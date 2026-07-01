# Fugle MarketData

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]
[![Coverage Status][codecov-image]][codecov-url]

> Fugle MarketData API client library for Node.js

## Installation

```sh
$ npm install --save @fugle/marketdata
```

## Importing

```js
// Using Node.js `require()`
const { RestClient, WebSocketClient } = require('@fugle/marketdata');

// Using ES6 imports
import { RestClient, WebSocketClient } from '@fugle/marketdata';
```

## Usage

The library is an isomorphic JavaScript client that supports REST API and WebSocket.

### REST API

```js
const client = new RestClient({ apiKey: 'YOUR_API_KEY' });

const stock = client.stock;   // Stock REST API client
const futopt = client.futopt; // Futures & Options REST API client

stock.intraday.quote({ symbol: '2330' })
  .then(data => console.log(data));
```

#### Futures & Options spread contracts

Spread (combination) contract symbols contain a `/` separator (e.g. `MXFA6/C6`).
The symbol is URL-encoded automatically, so you can pass it as-is. Their quotes
may carry **negative** prices.

```js
// List tradable spread contracts
futopt.intraday.tickers({ type: 'FUTURE', isSpread: true })
  .then(data => console.log(data));

// Quote a spread contract
futopt.intraday.quote({ symbol: 'MXFA6/C6' })
  .then(data => console.log(data));
```

The futopt quote response includes trial-matching (試搓) fields `lastTrial` and
`isTrial` (both `null`/`false` outside the trial session). You can also fetch
trial-matching trade ticks with `futopt.intraday.trades({ symbol, isTrial: true })`.

### WebSocket API

```js
const client = new WebSocketClient({ apiKey: 'YOUR_API_KEY' });

const stock = client.stock;   // Stock WebSocket API client
const futopt = client.futopt; // Futures & Options WebSocket API client

// open the WebSocket connection and authenticate
stock.connect().then(() => {
  // subscribe the channel to receive streaming data
  stock.subscribe({ channel: 'trades', symbol: '2330' });
});

stock.on('message', (message) => {
  const data = JSON.parse(message);
  console.log(data);
});
```

The futopt `books` channel may include an extended 6th order-book level as
`derivedBid` / `derivedAsk` (present only when the exchange sends DERIVED-FLAG),
and trial-session messages carry an `isTrial` flag.

### Health Check

The WebSocket client can monitor connection liveness using an app-level
JSON ping/pong (`{ event: 'ping' }` / `{ event: 'pong' }`). It is disabled by
default. When enabled, on each interval tick the client checks whether **any**
inbound message has arrived since the last ping it sent (freshness check):

- If nothing arrived since the last ping, that counts as a *miss* and the
  consecutive-miss counter is incremented.
- If any inbound message (a `pong`, market data, or anything else) arrived,
  the counter is reset to `0`.
- Once the consecutive-miss counter reaches `maxMissedPongs`, the client
  disconnects and stops the timer.

| Option           | Type      | Default | Description                                                       |
| ---------------- | --------- | ------- | ----------------------------------------------------------------- |
| `enabled`        | `boolean` | `false` | Enables the health-check ping/pong.                               |
| `pingInterval`   | `number`  | `30000` | Interval in milliseconds between health-check pings.              |
| `maxMissedPongs` | `number`  | `2`     | Consecutive misses (no inbound messages) before disconnecting.    |

```js
const client = new WebSocketClient({
  apiKey: 'YOUR_API_KEY',
  healthCheck: {
    enabled: true,
    pingInterval: 30000,
    maxMissedPongs: 2,
  },
});
```

#### Disconnect reason

When the client disconnects because of a health-check timeout, the
`disconnect` event carries a second argument `{ reason: 'health-check-timeout' }`.
Normal or manual disconnects emit `disconnect` **without** a second argument
(it is `undefined`). Listeners that only read the first argument (the close
event) continue to work unchanged.

```js
const stock = client.stock;

stock.on('disconnect', (event, info) => {
  if (info?.reason === 'health-check-timeout') {
    console.log('Health check timed out, reconnecting...');
    stock.connect().then(() => {
      stock.subscribe({ channel: 'trades', symbol: '2330' });
    });
  }
});
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fugle/marketdata.svg
[npm-url]: https://npmjs.com/package/@fugle/marketdata
[action-image]: https://img.shields.io/github/actions/workflow/status/fugle-dev/fugle-marketdata-node/node.js.yml?branch=master
[action-url]: https://github.com/fugle-dev/fugle-marketdata-node/actions/workflows/node.js.yml
[codecov-image]: https://img.shields.io/codecov/c/github/fugle-dev/fugle-marketdata-node.svg
[codecov-url]: https://codecov.io/gh/fugle-dev/fugle-marketdata-node

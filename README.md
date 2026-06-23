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

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fugle/marketdata.svg
[npm-url]: https://npmjs.com/package/@fugle/marketdata
[action-image]: https://img.shields.io/github/actions/workflow/status/fugle-dev/fugle-marketdata-node/node.js.yml?branch=master
[action-url]: https://github.com/fugle-dev/fugle-marketdata-node/actions/workflows/node.js.yml
[codecov-image]: https://img.shields.io/codecov/c/github/fugle-dev/fugle-marketdata-node.svg
[codecov-url]: https://codecov.io/gh/fugle-dev/fugle-marketdata-node

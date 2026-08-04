import { WebSocket } from 'ws';
import { WebSocketClient } from '../src';
import { WebSocketStockClient } from '../src/websocket/stock/client';
import { WebSocketFutOptClient } from '../src/websocket/futopt/client';
import { WS } from 'jest-websocket-mock';
import { FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL, FUGLE_MARKETDATA_API_VERSION, FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS } from '../src/constants';

jest.mock('isomorphic-ws', () => WebSocket);

const latest = (product: 'stock' | 'futopt') => {
  const versions = FUGLE_MARKETDATA_WS_SUPPORTED_VERSIONS[product];
  return versions[versions.length - 1];
};

describe('WebSocketClient', () => {
  afterEach(() => {
    WS.clean();
  });

  describe('constructor()', () => {
    it('should create a WebSocketClient instance with apiKey option', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      expect(client).toBeInstanceOf(WebSocketClient);
    });

    it('should create a WebSocketClient instance with bearerToken option', () => {
      const client = new WebSocketClient({ bearerToken: 'bearer-token' });
      expect(client).toBeInstanceOf(WebSocketClient);
    });

    it('should create a WebSocketClient instance with sdkToken option', () => {
      const client = new WebSocketClient({ sdkToken: 'sdk-token' });
      expect(client).toBeInstanceOf(WebSocketClient);
    });

    it('should throw an error if no options are specified', () => {
      expect(() => new WebSocketClient({})).toThrowError();
    });

    it('should throw an error if both apiKey and bearerToken are specified', () => {
      expect(() => new WebSocketClient({ apiKey: 'api-key', bearerToken: 'bearer-token' })).toThrowError();
    });

    it('should throw an error if both apiKey and sdkToken are specified', () => {
      expect(() => new WebSocketClient({ apiKey: 'api-key', sdkToken: 'sdk-token' })).toThrowError();
    });

    it('should throw an error if both bearerToken and sdkToken are specified', () => {
      expect(() => new WebSocketClient({ bearerToken: 'bearer-token', sdkToken: 'sdk-token' })).toThrowError();
    });

    it('should throw an error if all three tokens are specified', () => {
      expect(() => new WebSocketClient({ apiKey: 'api-key', bearerToken: 'bearer-token', sdkToken: 'sdk-token' })).toThrowError();
    });

    it('should create a WebSocketClient instance with custom baseUrl', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://custom-ws.example.com' });
      expect(client).toBeInstanceOf(WebSocketClient);
    });

  });

  describe('.stock', () => {
    let server: WS;

    beforeEach(() => {
      server = new WS(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${FUGLE_MARKETDATA_API_VERSION}/stock/streaming`);
    });

    it('should return a WebSocketStockClient instance', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      const stock = client.stock;
      expect(stock).toBeInstanceOf(WebSocketStockClient);
    });

    it('should return the same instance on multiple calls', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      const stock1 = client.stock;
      const stock2 = client.stock;
      expect(stock1).toBe(stock2);
    });

    it('should use custom baseUrl for stock client', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://custom-ws.example.com' });
      const stock = client.stock;
      expect(stock).toBeInstanceOf(WebSocketStockClient);
      // @ts-ignore - accessing private property for testing
      expect(stock.options.url).toBe('wss://custom-ws.example.com/v1.0/stock/streaming');
    });

    it('should use custom baseUrl for futopt client', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://custom-ws.example.com' });
      const futopt = client.futopt;
      expect(futopt).toBeInstanceOf(WebSocketFutOptClient);
      // @ts-ignore - accessing private property for testing
      expect(futopt.options.url).toBe('wss://custom-ws.example.com/v1.1/futopt/streaming');
    });

    describe('.connect()', () => {
      it('should open the WebSocket connection', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('connect', cb);
        stock.connect();
        await server.connected;
        expect(cb).toBeCalledTimes(1);
      });

      it('should receive message event from the server', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('message', cb);
        stock.connect();
        await server.connected;
        server.send('hello');
        expect(cb).toBeCalledTimes(1);
      });

      it('should emit error event if an error occurs', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('error', cb);
        stock.connect();
        await server.connected;
        server.error();
        expect(cb).toBeCalledTimes(1);
      });

      it('should disconnect from the server', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('disconnect', cb);
        stock.connect();
        await server.connected;
        server.close();
        expect(cb).toBeCalledTimes(1);
      });

      it('should send authenticate event with apiKey when connected', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } })]);
      });

      it('should send authenticate event with bearerToken when connected', async () => {
        const client = new WebSocketClient({ bearerToken: 'bearer-token' });
        const stock = client.stock;
        stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } })]);
      });

      it('should send authenticate event with sdkToken when connected', async () => {
        const client = new WebSocketClient({ sdkToken: 'sdk-token' });
        const stock = client.stock;
        stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { sdkToken: 'sdk-token' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { sdkToken: 'sdk-token' } })]);
      });

      it('should resolve the Promise when authenticated', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('authenticated', cb);
        const promise = stock.connect().catch();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } })]);
        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await expect(promise).resolves.toEqual({ message: 'Authenticated successfully' });
        expect(cb).toBeCalledTimes(1);
      });

      it('should reject the Promise event when unauthenticated', async () => {
        const client = new WebSocketClient({ bearerToken: 'bearer-token' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('unauthenticated', cb);
        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }));
        expect(server).toHaveReceivedMessages([ JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }) ]);
        server.send(JSON.stringify({ event: 'error', data: { message: 'Invalid authentication credentials' } }));
        await expect(promise).rejects.toEqual({ message: 'Invalid authentication credentials' });
        expect(cb).toBeCalledTimes(1);
      });
    });

    describe('.disconnect()', () => {
      it('should close the WebSocket connection', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const cb = jest.fn();
        stock.once('disconnect', cb);
        stock.connect();
        await server.connected;
        stock.disconnect();
        await server.closed;
        expect(cb).toBeCalledTimes(1);
      });
    });

    describe('.subscribe()', () => {
      it('should send subscribe event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        stock.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        stock.subscribe({ channel: 'trades', symbol: '2330' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'subscribe', data: { channel: 'trades', symbol: '2330' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'subscribe', data: { channel: 'trades', symbol: '2330' } }),
        ]);
      });
    });

    describe('.unsubscribe()', () => {
      it('should send unsubscribe event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        stock.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        stock.unsubscribe({ id: '1234567890' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'unsubscribe', data: { id: '1234567890' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'unsubscribe', data: { id: '1234567890' } }),
        ]);
      });
    });

    describe('.ping()', () => {
      it('should send ping event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        stock.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        stock.ping({ state: 'foo-bar' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: { state: 'foo-bar' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'ping', data: { state: 'foo-bar' } }),
        ]);
      });
    });

    describe('.subscriptions()', () => {
      it('should send subscriptions event', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        stock.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        stock.subscriptions();
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'subscriptions' }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'subscriptions' }),
        ]);
      });
    });
  });

  describe('.futopt', () => {
    let server: WS;

    beforeEach(() => {
      server = new WS(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${latest('futopt')}/futopt/streaming`);
    });

    it('should return a WebSocketFutOptClient instance', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      const futopt = client.futopt;
      expect(futopt).toBeInstanceOf(WebSocketFutOptClient);
    });

    it('should return the same instance on multiple calls', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      const futopt1 = client.futopt;
      const futopt2 = client.futopt;
      expect(futopt1).toBe(futopt2);
    });

    describe('.connect()', () => {
      it('should open the WebSocket connection', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('connect', cb);
        futopt.connect();
        await server.connected;
        expect(cb).toBeCalledTimes(1);
      });

      it('should receive message event from the server', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('message', cb);
        futopt.connect();
        await server.connected;
        server.send('hello');
        expect(cb).toBeCalledTimes(1);
      });

      it('should emit error event if an error occurs', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('error', cb);
        futopt.connect();
        await server.connected;
        server.error();
        expect(cb).toBeCalledTimes(1);
      });

      it('should disconnect from the server', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('disconnect', cb);
        futopt.connect();
        await server.connected;
        server.close();
        expect(cb).toBeCalledTimes(1);
      });

      it('should send authenticate event with apiKey when connected', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        futopt.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } })]);
      });

      it('should send authenticate event with bearerToken when connected', async () => {
        const client = new WebSocketClient({ bearerToken: 'bearer-token' });
        const futopt = client.futopt;
        futopt.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } })]);
      });

      it('should resolve the Promise when authenticated', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('authenticated', cb);
        const promise = futopt.connect().catch();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        expect(server).toHaveReceivedMessages([JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } })]);
        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await expect(promise).resolves.toEqual({ message: 'Authenticated successfully' });
        expect(cb).toBeCalledTimes(1);
      });

      it('should reject the Promise event when unauthenticated', async () => {
        const client = new WebSocketClient({ bearerToken: 'bearer-token' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('unauthenticated', cb);
        const promise = futopt.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }));
        expect(server).toHaveReceivedMessages([ JSON.stringify({ event: 'auth', data: { token: 'bearer-token' } }) ]);
        server.send(JSON.stringify({ event: 'error', data: { message: 'Invalid authentication credentials' } }));
        await expect(promise).rejects.toEqual({ message: 'Invalid authentication credentials' });
        expect(cb).toBeCalledTimes(1);
      });
    });

    describe('.disconnect()', () => {
      it('should close the WebSocket connection', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        const cb = jest.fn();
        futopt.once('disconnect', cb);
        futopt.connect();
        await server.connected;
        futopt.disconnect();
        await server.closed;
        expect(cb).toBeCalledTimes(1);
      });
    });

    describe('.subscribe()', () => {
      it('should send subscribe event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        futopt.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        futopt.subscribe({ channel: 'trades', symbol: 'TXFA3' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'subscribe', data: { channel: 'trades', symbol: 'TXFA3' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'subscribe', data: { channel: 'trades', symbol: 'TXFA3' } }),
        ]);
      });
    });

    describe('.unsubscribe()', () => {
      it('should send unsubscribe event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        futopt.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        futopt.unsubscribe({ id: '1234567890' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'unsubscribe', data: { id: '1234567890' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'unsubscribe', data: { id: '1234567890' } }),
        ]);
      });
    });

    describe('.ping()', () => {
      it('should send ping event with data', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        futopt.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        futopt.ping({ state: 'foo-bar' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: { state: 'foo-bar' } }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'ping', data: { state: 'foo-bar' } }),
        ]);
      });
    });

    describe('.subscriptions()', () => {
      it('should send subscriptions event', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const futopt = client.futopt;
        futopt.connect()
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));
        futopt.subscriptions();
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'subscriptions' }));
        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
          JSON.stringify({ event: 'subscriptions' }),
        ]);
      });
    });
  });

  describe('URL normalization', () => {
    it('should handle baseUrl without trailing slash', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://ws.example.com/marketdata' });
      const stock = client.stock;
      // @ts-ignore - accessing private property for testing
      expect(stock.options.url).toBe('wss://ws.example.com/marketdata/v1.0/stock/streaming');
    });

    it('should handle baseUrl with single trailing slash', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://ws.example.com/marketdata/' });
      const stock = client.stock;
      // @ts-ignore - accessing private property for testing
      expect(stock.options.url).toBe('wss://ws.example.com/marketdata/v1.0/stock/streaming');
    });

    it('should handle baseUrl with multiple trailing slashes', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://ws.example.com/marketdata///' });
      const stock = client.stock;
      // @ts-ignore - accessing private property for testing
      expect(stock.options.url).toBe('wss://ws.example.com/marketdata/v1.0/stock/streaming');
    });

    it('should treat a path segment that is not a vX.Y version as part of the prefix', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://ws.example.com/api/v2/' });
      const stock = client.stock;
      // @ts-ignore - accessing private property for testing
      expect(stock.options.url).toBe('wss://ws.example.com/api/v2/v1.0/stock/streaming');

      const futopt = client.futopt;
      // @ts-ignore - accessing private property for testing
      expect(futopt.options.url).toBe('wss://ws.example.com/api/v2/v1.1/futopt/streaming');
    });
  });

  describe('streaming version', () => {
    // @ts-ignore - accessing private property for testing
    const urlOf = (client: WebSocketClient, product: 'stock' | 'futopt') => client[product].options.url;

    it('should default each product to its latest version', () => {
      const client = new WebSocketClient({ apiKey: 'api-key' });
      expect(urlOf(client, 'futopt')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.1/futopt/streaming`);
      expect(urlOf(client, 'stock')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.0/stock/streaming`);
    });

    it('should treat an empty map the same as no version at all', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', version: {} });
      expect(urlOf(client, 'futopt')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.1/futopt/streaming`);
      expect(urlOf(client, 'stock')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.0/stock/streaming`);
    });

    it('should reject a bare version string at compile time', () => {
      // @ts-expect-error - version is a per-product map, not a scalar
      const client = new WebSocketClient({ apiKey: 'api-key', version: 'v1.1' });
      expect(() => client.futopt).toThrowError(
        "version must be a per-product map, not the bare string 'v1.1'. Use version: { futopt: 'v1.1' }."
      );
    });

    it('should name every product that serves a rejected bare version string', () => {
      // @ts-expect-error - version is a per-product map, not a scalar
      const client = new WebSocketClient({ apiKey: 'api-key', version: 'v1.0' });
      expect(() => client.stock).toThrowError(
        "version must be a per-product map, not the bare string 'v1.0'. Use version: { stock: 'v1.0', futopt: 'v1.0' }."
      );
    });

    it('should apply a per-product version map', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', version: { futopt: 'v1.1' } });
      expect(urlOf(client, 'futopt')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.1/futopt/streaming`);
      expect(urlOf(client, 'stock')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.0/stock/streaming`);
    });

    it('should pin futopt back to v1.0 through the map', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', version: { futopt: 'v1.0' } });
      expect(urlOf(client, 'futopt')).toBe(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/v1.0/futopt/streaming`);
    });

    it('should reject an unsupported product/version pair in the map at compile time', () => {
      // @ts-expect-error - stock only serves v1.0
      const client = new WebSocketClient({ apiKey: 'api-key', version: { stock: 'v1.1' } });
      expect(() => client.stock).toThrowError('stock streaming does not support v1.1');
    });

    it('should version a custom baseUrl per product, with no version option', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://fubon-api.fugle.tw/marketdata' });
      expect(urlOf(client, 'futopt')).toBe('wss://fubon-api.fugle.tw/marketdata/v1.1/futopt/streaming');
      expect(urlOf(client, 'stock')).toBe('wss://fubon-api.fugle.tw/marketdata/v1.0/stock/streaming');
    });

    it('should apply the version option to a custom baseUrl', () => {
      const client = new WebSocketClient({
        apiKey: 'api-key',
        baseUrl: 'wss://api-dev.fugle.tw/marketdata',
        version: { futopt: 'v1.0' },
      });
      expect(urlOf(client, 'futopt')).toBe('wss://api-dev.fugle.tw/marketdata/v1.0/futopt/streaming');
      expect(urlOf(client, 'stock')).toBe('wss://api-dev.fugle.tw/marketdata/v1.0/stock/streaming');
    });

    it('should reject a baseUrl carrying its own version segment', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://api-dev.fugle.tw/marketdata/v1.0' });
      expect(() => client.futopt).toThrowError(
        "baseUrl must not include a version segment (found '/v1.0'). " +
        "Pass the host and path prefix only: 'wss://api-dev.fugle.tw/marketdata'. " +
        "The version comes from the `version` option, e.g. version: { futopt: 'v1.1' }."
      );
    });

    it('should reject a versioned baseUrl after trailing slashes are trimmed', () => {
      const client = new WebSocketClient({ apiKey: 'api-key', baseUrl: 'wss://api-dev.fugle.tw/marketdata/v1.0//' });
      expect(() => client.futopt).toThrowError("baseUrl must not include a version segment (found '/v1.0')");
    });
  });

  describe('Health Check', () => {
    let server: WS;

    beforeEach(() => {
      server = new WS(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${FUGLE_MARKETDATA_API_VERSION}/stock/streaming`);
    });

    describe('Basic functionality', () => {
      it('should start health check timer when authenticated with healthCheck enabled', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 100 }
        });
        const stock = client.stock;

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Wait for first ping from health check
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));

        stock.disconnect();
      });

      it('should use default pingInterval when not specified', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true }
        });
        const stock = client.stock;

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Default interval is 30000ms, but we can't wait that long in tests
        // Just verify the connection is established with health check
        stock.disconnect();
      });

      it('should not send any ping when health check is disabled', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key'
        });
        const stock = client.stock;

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Manually call detectConnectionStatus to test the early return path
        // @ts-ignore - accessing private method for testing
        stock.detectConnectionStatus();

        // Should not send any ping message
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(server).toHaveReceivedMessages([
          JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }),
        ]);

        stock.disconnect();
      });

      it('should clear ping timer when disconnected', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 100 }
        });
        const stock = client.stock;

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Wait for first ping
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));

        const messagesBefore = server.messages.length;

        // Disconnect
        stock.disconnect();
        await server.closed;

        // Wait to ensure no more pings are sent
        await new Promise(resolve => setTimeout(resolve, 200));

        // No new messages should have been received after disconnect
        expect(server.messages.length).toBe(messagesBefore);
      });
    });

    describe('Freshness-based detection', () => {
      it('should NOT disconnect while any inbound message keeps the connection fresh', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 2 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // For several cycles, send some inbound data (NOT a pong) after each ping.
        // Any inbound message resets freshness, so no disconnect should happen.
        for (let i = 0; i < 4; i++) {
          await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
          server.send(JSON.stringify({ event: 'data', data: { foo: 'bar' } }));
        }

        expect(disconnectCb).not.toHaveBeenCalled();
        stock.disconnect();
      });

      it('should treat a pong like any other inbound message and stay fresh', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 2 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        for (let i = 0; i < 4; i++) {
          await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
          server.send(JSON.stringify({ event: 'pong' }));
        }

        expect(disconnectCb).not.toHaveBeenCalled();
        stock.disconnect();
      });

      it('should clamp maxMissedPongs to >= 1 (0 must not disconnect a healthy connection)', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 0 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Keep the connection fresh; with a correct clamp it should never disconnect.
        for (let i = 0; i < 3; i++) {
          await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
          server.send(JSON.stringify({ event: 'data', data: {} }));
        }

        expect(disconnectCb).not.toHaveBeenCalled();
        stock.disconnect();
      });
    });

    describe('Error handling and auto-disconnect', () => {
      it('should disconnect after maxMissedPongs consecutive misses (no inbound messages)', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 2 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Receive pings without sending anything back -> consecutive misses accumulate
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));

        // Should disconnect once misses reach maxMissedPongs
        await server.closed;
        expect(disconnectCb).toHaveBeenCalled();
      });

      it('should carry { reason: "health-check-timeout" } in the disconnect event on timeout', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 2 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        await server.closed;
        expect(disconnectCb).toHaveBeenCalled();
        // Second arg carries the health-check timeout reason.
        expect(disconnectCb.mock.calls[0][1]).toEqual({ reason: 'health-check-timeout' });
      });

      it('should accumulate consecutive misses and reset them when a message arrives', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50, maxMissedPongs: 3 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Two misses, then a message resets the counter, then more pings.
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
        // Reset freshness before reaching 3 misses.
        server.send(JSON.stringify({ event: 'data', data: {} }));
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));

        expect(disconnectCb).not.toHaveBeenCalled();
        stock.disconnect();
      });

      it('should handle ping send failure and disconnect with the timeout reason', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 50 }
        });
        const stock = client.stock;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Mock socket.send to throw an error on the next ping
        // @ts-ignore
        stock.socket.send = jest.fn(() => {
          throw new Error('Network error');
        });

        // Wait for health check to trigger and fail
        await server.closed;

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to send ping'));
        expect(disconnectCb).toHaveBeenCalled();
        expect(disconnectCb.mock.calls[0][1]).toEqual({ reason: 'health-check-timeout' });

        consoleErrorSpy.mockRestore();
      });
    });

    describe('Normal disconnect', () => {
      it('should emit disconnect with undefined second arg on manual disconnect', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 100 }
        });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        stock.disconnect();
        await server.closed;

        expect(disconnectCb).toHaveBeenCalled();
        // No reason payload on a normal/manual disconnect.
        expect(disconnectCb.mock.calls[0][1]).toBeUndefined();
      });

      it('should emit disconnect with undefined second arg when the server closes', async () => {
        const client = new WebSocketClient({ apiKey: 'api-key' });
        const stock = client.stock;
        const disconnectCb = jest.fn();
        stock.once('disconnect', disconnectCb);

        stock.connect();
        await server.connected;
        server.close();
        await server.closed;

        expect(disconnectCb).toHaveBeenCalled();
        expect(disconnectCb.mock.calls[0][1]).toBeUndefined();
      });
    });

    describe('Integration scenarios', () => {
      it('should work alongside normal subscribe/unsubscribe operations', async () => {
        const client = new WebSocketClient({
          apiKey: 'api-key',
          healthCheck: { enabled: true, pingInterval: 100 }
        });
        const stock = client.stock;

        const promise = stock.connect();
        await server.connected;
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'auth', data: { apikey: 'api-key' } }));

        server.send(JSON.stringify({ event: 'authenticated', data: { message: 'Authenticated successfully' } }));
        await promise;

        // Normal operations
        stock.subscribe({ channel: 'trades', symbol: '2330' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'subscribe', data: { channel: 'trades', symbol: '2330' } }));

        // Health check ping
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'ping', data: {} }));
        server.send(JSON.stringify({ event: 'pong' }));

        // More normal operations
        stock.unsubscribe({ id: '12345' });
        await expect(server).toReceiveMessage(JSON.stringify({ event: 'unsubscribe', data: { id: '12345' } }));

        stock.disconnect();
      });
    });
  });
});

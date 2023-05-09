import { WebSocket } from 'ws';
import { WebSocketClient } from '../src';
import { WebSocketStockClient } from '../src/websocket/stock/client';
import { WebSocketFutOptClient } from '../src/websocket/futopt/client';
import { WS } from 'jest-websocket-mock';
import { FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL, FUGLE_MARKETDATA_API_VERSION } from '../src/constants';

jest.mock('isomorphic-ws', () => WebSocket);

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

    it('should throw an error if no options are specified', () => {
      expect(() => new WebSocketClient({})).toThrowError();
    });

    it('should throw an error if both apiKey and bearerToken are specified', () => {
      expect(() => new WebSocketClient({ apiKey: 'api-key', bearerToken: 'bearer-token' })).toThrowError();
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
  });

  describe('.futopt', () => {
    let server: WS;

    beforeEach(() => {
      server = new WS(`${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${FUGLE_MARKETDATA_API_VERSION}/futopt/streaming`);
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
  });
});

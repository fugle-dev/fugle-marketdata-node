import * as fetch from 'isomorphic-fetch';
import { RestClient } from '../src';
import { RestStockClient } from '../src/rest/stock/client';
import { RestFutOptClient } from '../src/rest/futopt/client';

jest.mock('isomorphic-fetch', () => jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })));

describe('RestClient', () => {
  describe('constructor()', () => {
    it('should create a RestClient instance with apiKey option', () => {
      const client = new RestClient({ apiKey: 'api-key' });
      expect(client).toBeInstanceOf(RestClient);
    });

    it('should create a RestClient instance with bearerToken option', () => {
      const client = new RestClient({ bearerToken: 'bearer-token' });
      expect(client).toBeInstanceOf(RestClient);
    });

    it('should throw an error if no options are specified', () => {
      expect(() => new RestClient({})).toThrowError();
    });

    it('should throw an error if both apiKey and bearerToken are specified', () => {
      expect(() => new RestClient({ apiKey: 'api-key', bearerToken: 'bearer-token' })).toThrowError();
    });
  });

  describe('.stock', () => {
    it('should return a RestStockClient instance', () => {
      const client = new RestClient({ apiKey: 'api-key' });
      const stock = client.stock;
      expect(stock).toBeInstanceOf(RestStockClient);
    });

    it('should return the same instance on multiple calls', () => {
      const client = new RestClient({ apiKey: 'api-key' });
      const stock1 = client.stock;
      const stock2 = client.stock;
      expect(stock1).toBe(stock2);
    });

    describe('.intraday', () => {
      it('should contain stock intraday api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const stock = client.stock as RestStockClient;
        expect(stock.intraday).toBeDefined();
        expect(stock.intraday).toHaveProperty('tickers');
        expect(stock.intraday).toHaveProperty('ticker');
        expect(stock.intraday).toHaveProperty('quote');
        expect(stock.intraday).toHaveProperty('candles');
        expect(stock.intraday).toHaveProperty('trades');
        expect(stock.intraday).toHaveProperty('volumes');
      });

      describe('.tickers()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.tickers({ type: 'INDEX' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/tickers?type=INDEX',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.tickers({ type: 'INDEX' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/tickers?type=INDEX',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.ticker()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.ticker({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.ticker({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.quote()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.quote({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.quote({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.candles()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.candles({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.candles({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.trades()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.trades({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/trades/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.trades({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/trades/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.volumes()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.volumes({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/volumes/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.intraday.volumes({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/intraday/volumes/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });

    describe('.historical', () => {
      it('should contain stock historical api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const stock = client.stock as RestStockClient;
        expect(stock.historical).toBeDefined();
        expect(stock.historical).toHaveProperty('candles');
        expect(stock.historical).toHaveProperty('stats');
      });

      describe('.candles()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.historical.candles({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.historical.candles({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.stats()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.historical.stats({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/historical/stats/2330',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.historical.stats({ symbol: '2330' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/historical/stats/2330',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });

    describe('.snapshot', () => {
      it('should contain stock intraday api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const stock = client.stock as RestStockClient;
        expect(stock.snapshot).toBeDefined();
        expect(stock.snapshot).toHaveProperty('quotes');
        expect(stock.snapshot).toHaveProperty('movers');
        expect(stock.snapshot).toHaveProperty('actives');
      });

      describe('.quotes()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.quotes({ market: 'TSE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/quotes/TSE',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.quotes({ market: 'TSE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/quotes/TSE',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.movers()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.movers({ market: 'TSE', change: 'percent', direction: 'up' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/movers/TSE?change=percent&direction=up',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.movers({ market: 'TSE', change: 'percent', direction: 'up' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/movers/TSE?change=percent&direction=up',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.actives()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.actives({ market: 'TSE', trade: 'volume' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/actives/TSE?trade=volume',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.snapshot.actives({ market: 'TSE', trade: 'volume' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/actives/TSE?trade=volume',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });

    describe('.technical', () => {
      it('should contain stock technical api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const stock = client.stock as RestStockClient;
        expect(stock.technical).toBeDefined();
        expect(stock.technical).toHaveProperty('sma');
        expect(stock.technical).toHaveProperty('rsi');
        expect(stock.technical).toHaveProperty('kdj');
        expect(stock.technical).toHaveProperty('macd');
        expect(stock.technical).toHaveProperty('bb');
      });

      describe('.sma()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.technical.sma({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 5 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/sma/2330?from=2024-01-01&period=5&timeframe=D&to=2024-12-31',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.technical.sma({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 5 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/sma/2330?from=2024-01-01&period=5&timeframe=D&to=2024-12-31',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.rsi()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.technical.rsi({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 6 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/rsi/2330?from=2024-01-01&period=6&timeframe=D&to=2024-12-31',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.technical.rsi({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 6 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/rsi/2330?from=2024-01-01&period=6&timeframe=D&to=2024-12-31',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.kdj()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.technical.kdj({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', rPeriod: 14, kPeriod: 9, dPeriod: 3 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/kdj/2330?dPeriod=3&from=2024-01-01&kPeriod=9&rPeriod=14&timeframe=D&to=2024-12-31',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.technical.kdj({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', rPeriod: 14, kPeriod: 9, dPeriod: 3 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/kdj/2330?dPeriod=3&from=2024-01-01&kPeriod=9&rPeriod=14&timeframe=D&to=2024-12-31',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.macd()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.technical.macd({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', fast: 12, slow: 26, signal: 9 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/macd/2330?fast=12&from=2024-01-01&signal=9&slow=26&timeframe=D&to=2024-12-31',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.technical.macd({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', fast: 12, slow: 26, signal: 9 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/macd/2330?fast=12&from=2024-01-01&signal=9&slow=26&timeframe=D&to=2024-12-31',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.bb()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const stock = client.stock as RestStockClient;
          await stock.technical.bb({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 20 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/bb/2330?from=2024-01-01&period=20&timeframe=D&to=2024-12-31',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const stock = client.stock as RestStockClient;
          await stock.technical.bb({ symbol: '2330', from: '2024-01-01', to: '2024-12-31', timeframe: 'D', period: 20 });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/stock/technical/bb/2330?from=2024-01-01&period=20&timeframe=D&to=2024-12-31',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });
  });

  describe('.futopt', () => {
    it('should return a RestFutOptClient instance', () => {
      const client = new RestClient({ apiKey: 'api-key' });
      const futopt = client.futopt;
      expect(futopt).toBeInstanceOf(RestFutOptClient);
    });

    it('should return the same instance on multiple calls', () => {
      const client = new RestClient({ apiKey: 'api-key' });
      const futopt1 = client.futopt;
      const futopt2 = client.futopt;
      expect(futopt1).toBe(futopt2);
    });

    describe('.intraday', () => {
      it('should contain futopt intraday api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const futopt = client.futopt as RestFutOptClient;
        expect(futopt.intraday).toBeDefined();
        expect(futopt.intraday).toHaveProperty('products');
        expect(futopt.intraday).toHaveProperty('tickers');
        expect(futopt.intraday).toHaveProperty('ticker');
        expect(futopt.intraday).toHaveProperty('quote');
        expect(futopt.intraday).toHaveProperty('candles');
        expect(futopt.intraday).toHaveProperty('trades');
        expect(futopt.intraday).toHaveProperty('volumes');
      });

      describe('.products()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.products({ type: 'FUTURE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/products?type=FUTURE',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.products({ type: 'FUTURE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/products?type=FUTURE',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.tickers()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.tickers({ type: 'FUTURE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/tickers?type=FUTURE',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.tickers({ type: 'FUTURE' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/tickers?type=FUTURE',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });


      describe('.ticker()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.ticker({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/ticker/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.ticker({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/ticker/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.quote()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.quote({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/quote/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.quote({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/quote/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.candles()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.candles({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/candles/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.candles({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/candles/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.trades()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.trades({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/trades/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.trades({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/trades/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.volumes()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.volumes({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/volumes/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.intraday.volumes({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/intraday/volumes/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });

    describe('.historical', () => {
      it('should contain futopt historical api endpoints', () => {
        const client = new RestClient({ apiKey: 'api-key' });
        const futopt = client.futopt as RestFutOptClient;
        expect(futopt.historical).toBeDefined();
        expect(futopt.historical).toHaveProperty('candles');
        expect(futopt.historical).toHaveProperty('daily');
      });

      describe('.candles()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.historical.candles({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/historical/candles/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.historical.candles({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/historical/candles/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });

      describe('.daily()', () => {
        it('should request with api key', async () => {
          const client = new RestClient({ apiKey: 'api-key' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.historical.daily({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/historical/daily/TXFH4',
            { headers: { 'X-API-KEY': 'api-key' } },
          );
        });

        it('should request with bearer token', async () => {
          const client = new RestClient({ bearerToken: 'bearer-token' });
          const futopt = client.futopt as RestFutOptClient;
          await futopt.historical.daily({ symbol: 'TXFH4' });
          expect(fetch).toBeCalledWith(
            'https://api.fugle.tw/marketdata/v1.0/futopt/historical/daily/TXFH4',
            { headers: { 'Authorization': 'Bearer bearer-token' } },
          );
        });
      });
    });

  });
});

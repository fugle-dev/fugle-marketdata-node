import { RestClient } from '../client';
import { RestStockIntradayTickersParams, tickers } from './intraday/tickers';
import { RestStockIntradayTickerParams, ticker } from './intraday/ticker';
import { RestStockIntradayQuoteParams, quote } from './intraday/quote';
import { RestStockIntradayCandlesParams, candles } from './intraday/candles';
import { RestStockIntradayTradesParams, trades } from './intraday/trades';
import { RestStockIntradayVolumesParams, volumes } from './intraday/volumes';
import { RestStockHistoricalCandlesParams, candles as historicalCandles } from './historical/candles';
import { RestStockHistoricalStatsParams, stats } from './historical/stats';
import { RestStockSnapshotQuotesParams, quotes } from './snapshot/quotes';
import { RestStockSnapshotMoversParams, movers } from './snapshot/movers';
import { RestStockSnapshotActivesParams, actives } from './snapshot/actives';

export class RestStockClient extends RestClient {
  get intraday() {
    const request = this.request;
    return {
      tickers: (params: RestStockIntradayTickersParams) => tickers(request, params),
      ticker: (params: RestStockIntradayTickerParams) => ticker(request, params),
      quote: (params: RestStockIntradayQuoteParams) => quote(request, params),
      candles: (params: RestStockIntradayCandlesParams) => candles(request, params),
      trades: (params: RestStockIntradayTradesParams) => trades(request, params),
      volumes: (params: RestStockIntradayVolumesParams) => volumes(request, params),
    };
  }

  get historical() {
    const request = this.request;
    return {
      candles: (params: RestStockHistoricalCandlesParams) => historicalCandles(request, params),
      stats: (params: RestStockHistoricalStatsParams) => stats(request, params),
    };
  }

  get snapshot() {
    const request = this.request;
    return {
      quotes: (params: RestStockSnapshotQuotesParams) => quotes(request, params),
      movers: (params: RestStockSnapshotMoversParams) => movers(request, params),
      actives: (params: RestStockSnapshotActivesParams) => actives(request, params),
    };
  }
}

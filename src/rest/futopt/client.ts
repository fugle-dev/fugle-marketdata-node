import { RestClient } from '../client';
import { RestFutOptIntradayProductsParams, products } from './intraday/products';
import { RestFutOptIntradayTickersParams, tickers } from './intraday/tickers';
import { RestFutOptIntradayTickerParams, ticker } from './intraday/ticker';
import { RestFutOptIntradayQuoteParams, quote } from './intraday/quote';
import { RestFutOptIntradayCandlesParams, candles } from './intraday/candles';
import { RestFutOptIntradayTradesParams, trades } from './intraday/trades';
import { RestFutOptIntradayVolumesParams, volumes } from './intraday/volumes';




export class RestFutOptClient extends RestClient {
  get intraday() {
    const request = this.request;
    return {
      products: (params: RestFutOptIntradayProductsParams) => products(request, params),
      tickers: (params: RestFutOptIntradayTickersParams) => tickers(request, params),
      ticker: (params: RestFutOptIntradayTickerParams) => ticker(request, params),
      quote: (params: RestFutOptIntradayQuoteParams) => quote(request, params),
      candles: (params: RestFutOptIntradayCandlesParams) => candles(request, params),
      trades: (params: RestFutOptIntradayTradesParams) => trades(request, params),
      volumes: (params: RestFutOptIntradayVolumesParams) => volumes(request, params),
    };
  }
}

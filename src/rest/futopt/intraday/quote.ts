import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayQuoteParams {
  symbol: string;
  session?: 'afterhours';
}

export interface RestFutOptIntradayQuoteResponse {
  date: string;
  type: string;
  exchange: string;
  symbol: string;
  name: string;
  previousClose: number;
  openPrice: number;
  openTime: number;
  highPrice: number;
  highTime: number;
  lowPrice: number;
  lowTime: number;
  closePrice: number;
  closeTime: number;
  lastPrice: number;
  lastSize: number;
  avgPrice: number;
  change: number;
  changePercent: number;
  amplitude: number;
  bids: Array<{
    price: number;
    size: number;
  }>;
  asks: Array<{
    price: number;
    size: number;
  }>;
  total: {
    tradeVolume: number;
    totalBidMatch: number;
    totalAskMatch: number;
  };
  lastTrade: {
    price: number;
    size: number;
    time: number;
  };
  lastUpdated: number;
}

export const quote = (request: RestClientRequest, params: RestFutOptIntradayQuoteParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/quote/${symbol}`, options) as Promise<RestFutOptIntradayQuoteResponse>;
}

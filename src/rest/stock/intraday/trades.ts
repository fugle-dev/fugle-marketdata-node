import { RestClientRequest } from '../../client';

export interface RestStockIntradayTradesParams {
  symbol: string;
  type?: 'oddlot';
  offset?: number;
  limit?: number;
  isTrial?: boolean;
}

export interface RestStockIntradayTradesResponse {
  date: string;
  type: string;
  exchange: string;
  market: string;
  symbol: string;
  data: Array<{
    bid: number;
    ask: number;
    price: number;
    size: number;
    time: number;
  }>;
}

export const trades = (request: RestClientRequest, params: RestStockIntradayTradesParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/trades/${symbol}`, options) as Promise<RestStockIntradayTradesResponse>;
}

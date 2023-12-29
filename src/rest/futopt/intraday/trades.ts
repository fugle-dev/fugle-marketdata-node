import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayTradesParams {
  symbol: string;
  session?: 'afterhours';
  offset?: number;
  limit?: number;
}

export interface RestFutOptIntradayTradesResponse {
  date: string;
  type: string;
  exchange: string;
  symbol: string;
  data: Array<{
    price: number;
    size: number;
    time: number;
  }>;
}

export const trades = (request: RestClientRequest, params: RestFutOptIntradayTradesParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/trades/${symbol}`, options) as Promise<RestFutOptIntradayTradesResponse>;
}

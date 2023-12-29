import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayTickerParams {
  symbol: string;
  session?: 'afterhours';
}

export interface RestFutOptIntradayTickerResponse {
  date: string;
  type: string;
  exchange: string;
  symbol: string;
  name: string;
  referencePrice: number;
  startDate: string;
  endDate: string;
  settlementDate: string;
}

export const ticker = (request: RestClientRequest, params: RestFutOptIntradayTickerParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/ticker/${symbol}`, options) as Promise<RestFutOptIntradayTickerResponse>;
}

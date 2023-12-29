import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayCandlesParams {
  symbol: string;
  session?: 'afterhours';
  timeframe?: '1' | '5' | '10' | '15' | '30' | '60';
}

export interface RestFutOptIntradayCandlesResponse {
  date: string;
  type: string;
  exchange: string;
  symbol: string;
  timeframe: string;
  data: Array<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    average: number;
    time: number;
  }>;
}

export const candles = (request: RestClientRequest, params: RestFutOptIntradayCandlesParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/candles/${symbol}`, options) as Promise<RestFutOptIntradayCandlesResponse>;
}

import { RestClientRequest } from '../../client';

export interface RestStockIntradayCandlesParams {
  symbol: string;
  type?: 'oddlot';
  timeframe?: '1' | '5' | '10' | '15' | '30' | '60';
}

export interface RestStockIntradayCandlesResponse {
  date: string;
  type: string;
  exchange: string;
  market: string;
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

export const candles = (request: RestClientRequest, params: RestStockIntradayCandlesParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/candles/${symbol}`, options) as Promise<RestStockIntradayCandlesResponse>;
}

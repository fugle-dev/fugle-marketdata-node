import { RestClientRequest } from '../../client';

export interface RestStockIntradayCandlesParams {
  symbol: string;
  type?: 'oddlot';
}

export interface RestStockIntradayCandlesResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
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

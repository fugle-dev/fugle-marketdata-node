import { RestClientRequest } from '../../client';

export interface RestStockTechnicalMacdParams {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: 'D' | 'W' | 'M' | '1' | '3' | '5' | '10' | '15' | '30' | '60';
  fast: number;
  slow: number;
  signal: number;
}

export interface RestStockTechnicalMacdResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
  timeframe: string;
  data: Array<{
    date: string;
    macdLine: number;
    signalLine: number;
  }>;
}

export const macd = (request: RestClientRequest, params: RestStockTechnicalMacdParams) => {
  const { symbol, ...options } = params;
  return request(`technical/macd/${symbol}`, options) as Promise<RestStockTechnicalMacdResponse>;
}

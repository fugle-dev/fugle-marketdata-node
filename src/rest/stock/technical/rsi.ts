import { RestClientRequest } from '../../client';

export interface RestStockTechnicalRsiParams {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: 'D' | 'W' | 'M' | '1' | '3' | '5' | '10' | '15' | '30' | '60';
  period: number;
}

export interface RestStockTechnicalRsiResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
  timeframe: string;
  data: Array<{
    date: string;
    rsi: number;
  }>;
}

export const rsi = (request: RestClientRequest, params: RestStockTechnicalRsiParams) => {
  const { symbol, ...options } = params;
  return request(`technical/rsi/${symbol}`, options) as Promise<RestStockTechnicalRsiResponse>;
}

import { RestClientRequest } from '../../client';

export interface RestStockTechnicalBbParams {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: 'D' | 'W' | 'M' | '1' | '3' | '5' | '10' | '15' | '30' | '60';
  period: number;
}

export interface RestStockTechnicalBbResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
  timeframe: string;
  data: Array<{
    date: string;
    upper: number;
    middle: number;
    lower: number;
  }>;
}

export const bb = (request: RestClientRequest, params: RestStockTechnicalBbParams) => {
  const { symbol, ...options } = params;
  return request(`technical/bb/${symbol}`, options) as Promise<RestStockTechnicalBbResponse>;
}

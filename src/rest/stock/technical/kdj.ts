import { RestClientRequest } from '../../client';

export interface RestStockTechnicalKdjParams {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: 'D' | 'W' | 'M' | '1' | '3' | '5' | '10' | '15' | '30' | '60';
  rPeriod: number;
  kPeriod: number;
  dPeriod: number;
}

export interface RestStockTechnicalKdjResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
  timeframe: string;
  data: Array<{
    date: string;
    k: number;
    d: number;
    j: number;
  }>;
}

export const kdj = (request: RestClientRequest, params: RestStockTechnicalKdjParams) => {
  const { symbol, ...options } = params;
  return request(`technical/kdj/${symbol}`, options) as Promise<RestStockTechnicalKdjResponse>;
}

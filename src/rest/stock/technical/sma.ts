import { RestClientRequest } from '../../client';

export interface RestStockTechnicalSmaParams {
  symbol: string;
  from?: string;
  to?: string;
  timeframe?: 'D' | 'W' | 'M' | '1' | '3' | '5' | '10' | '15' | '30' | '60';
  period: number;
}

export interface RestStockTechnicalSmaResponse {
  symbol: string;
  type: string;
  exchange: string;
  market: string;
  timeframe: string;
  data: Array<{
    date: string;
    sma: number;
  }>;
}

export const sma = (request: RestClientRequest, params: RestStockTechnicalSmaParams) => {
  const { symbol, ...options } = params;
  return request(`technical/sma/${symbol}`, options) as Promise<RestStockTechnicalSmaResponse>;
}

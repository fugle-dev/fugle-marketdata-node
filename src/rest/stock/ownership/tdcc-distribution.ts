import { RestClientRequest } from '../../client';

export interface RestStockOwnershipTdccDistributionParams {
  symbol: string;
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

export interface RestStockOwnershipTdccDistributionLevel {
  range: string;
  holders: number;
  shares: number;
  proportion: number;
}

export interface RestStockOwnershipTdccDistributionResponse {
  type?: string;
  exchange?: string;
  market?: string;
  symbol: string;
  data: Array<{
    date: string;
    distributions: RestStockOwnershipTdccDistributionLevel[];
  }>;
}

export const tdccDistribution = (request: RestClientRequest, params: RestStockOwnershipTdccDistributionParams) => {
  const { symbol, ...options } = params;
  return request(`ownership/tdcc-distribution/${symbol}`, options) as Promise<RestStockOwnershipTdccDistributionResponse>;
}

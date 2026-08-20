import { RestClientRequest } from '../../client';

export interface RestStockOwnershipInstitutionalTradesParams {
  symbol: string;
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

export interface RestStockOwnershipInstitutionalTradesInvestor {
  buy: number;
  sell: number;
  net: number;
}

export interface RestStockOwnershipInstitutionalTradesResponse {
  type?: string;
  exchange?: string;
  market?: string;
  symbol: string;
  data: Array<{
    date: string;
    foreign: RestStockOwnershipInstitutionalTradesInvestor;
    trust: RestStockOwnershipInstitutionalTradesInvestor;
    dealer: RestStockOwnershipInstitutionalTradesInvestor;
    total: number;
  }>;
}

export const institutionalTrades = (request: RestClientRequest, params: RestStockOwnershipInstitutionalTradesParams) => {
  const { symbol, ...options } = params;
  return request(`ownership/institutional-trades/${symbol}`, options) as Promise<RestStockOwnershipInstitutionalTradesResponse>;
}

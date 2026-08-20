import { RestClientRequest } from '../../client';

export interface RestStockOwnershipDirectorHoldingsParams {
  symbol: string;
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

export interface RestStockOwnershipDirectorHoldingsDirector {
  order: number;
  title: string;
  name: string;
  electedShares: number;
  heldShares: number;
  pledgedShares: number;
  pledgeRatio: number;
  relatedHeldShares: number;
  relatedPledgedShares: number;
  relatedPledgeRatio: number;
}

export interface RestStockOwnershipDirectorHoldingsResponse {
  type?: string;
  exchange?: string;
  market?: string;
  symbol: string;
  data: Array<{
    /** yyyy-MM (monthly) */
    date: string;
    directors: RestStockOwnershipDirectorHoldingsDirector[];
  }>;
}

export const directorHoldings = (request: RestClientRequest, params: RestStockOwnershipDirectorHoldingsParams) => {
  const { symbol, ...options } = params;
  return request(`ownership/director-holdings/${symbol}`, options) as Promise<RestStockOwnershipDirectorHoldingsResponse>;
}

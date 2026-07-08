import { RestClientRequest } from '../../client';

export interface RestStockOwnershipEtfHoldingsParams {
  symbol: string;
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

export interface RestStockOwnershipEtfHoldingsComponent {
  symbol: string;
  name: string;
  quantity: number;
  weight: number;
  quantityChange?: number;
  weightChange?: number;
}

export interface RestStockOwnershipEtfHoldingsResponse {
  type?: string;
  exchange?: string;
  market?: string;
  symbol: string;
  data: Array<{
    date: string;
    components: RestStockOwnershipEtfHoldingsComponent[];
  }>;
}

export const etfHoldings = (request: RestClientRequest, params: RestStockOwnershipEtfHoldingsParams) => {
  const { symbol, ...options } = params;
  return request(`ownership/etf-holdings/${symbol}`, options) as Promise<RestStockOwnershipEtfHoldingsResponse>;
}

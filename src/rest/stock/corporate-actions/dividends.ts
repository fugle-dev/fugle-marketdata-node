import { RestClientRequest } from '../../client';

export interface RestStockCorporateActionsDividendsParams {
  start_date?: string;
  end_date?: string;
  sort?: 'asc' | 'desc';
}

export interface Dividend {
  date: string;
  exchange: string | null;
  symbol: string;
  name: string | null;
  previousClose: number | null;
  referencePrice: number | null;
  dividend: number | null;
  dividendType: string | null;
  limitUpPrice: number | null;
  limitDownPrice: number | null;
  openingReferencePrice: number | null;
  exdividendReferencePrice: number | null;
  cashDividend: number | null;
  stockDividendShares: number | null;
}

export interface RestStockCorporateActionsDividendsResponse {
  start_date: string;
  end_date: string;
  sort: string;
  data: Dividend[];
}

export const dividends = (request: RestClientRequest, params?: RestStockCorporateActionsDividendsParams) => {
  return request('corporate-actions/dividends', params ?? {}) as Promise<RestStockCorporateActionsDividendsResponse>;
}

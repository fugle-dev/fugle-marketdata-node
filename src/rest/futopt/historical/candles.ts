import { RestClientRequest } from "../../client";

export interface RestFutOptHistoricalCandlesParams {
  product: string;
  contractMonth?: string;
  from?: string;
  to?: string;
  fields?: string;
  timeframe?: '1' | '5' | '10' | '15' | '30' | '60' | 'D' | 'W' | 'M';
  sort?: 'asc' | 'desc';
  session?: 'afterhours';
  /** Options only; must be given together with `callPut`. */
  strikePrice?: number;
  /** Options only; must be given together with `strikePrice`. */
  callPut?: 'CALL' | 'PUT';
}

export interface RestFutOptHistoricalCandlesResponse {
  product: string;
  contractMonth: string;
  exchange: string;
  session: string;
  timeframe: '1' | '5' | '10' | '15' | '30' | '60' | 'D' | 'W' | 'M';
  sort: 'asc' | 'desc';
  /** Echoed for option queries only. */
  strikePrice?: number;
  /** Echoed for option queries only. */
  callPut?: 'CALL' | 'PUT';
  data: Array<{
    date: string;
    contractMonth: string;
    open?: number | null;
    high?: number | null;
    low?: number | null;
    close?: number | null;
    volume?: number;
    average?: number;
    transaction?: number;
    change?: number | null;
  }>;
}


export const candles = (request: RestClientRequest, params: RestFutOptHistoricalCandlesParams) => {
  const { product, ...options } = params;
  return request(`historical/candles/${encodeURIComponent(product)}`, options) as Promise<RestFutOptHistoricalCandlesResponse>;
}

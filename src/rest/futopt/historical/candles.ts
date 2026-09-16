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
}

export interface RestFutOptHistoricalCandlesResponse {
  product: string;
  contractMonth: string;
  exchange: string;
  session: string;
  timeframe: '1' | '5' | '10' | '15' | '30' | '60' | 'D' | 'W' | 'M';
  sort: 'asc' | 'desc';
  data: Array<{
    date: string;
    contractMonth: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    average?: number;
    transaction?: number;
    change?: number;
  }>;
}


export const candles = (request: RestClientRequest, params: RestFutOptHistoricalCandlesParams) => {
  const { product, ...options } = params;
  return request(`historical/candles/${encodeURIComponent(product)}`, options) as Promise<RestFutOptHistoricalCandlesResponse>;
}

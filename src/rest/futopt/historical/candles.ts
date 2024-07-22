import { RestClientRequest } from "../../client";

export interface RestFutOptHistoricalCandlesParams {
  symbol: string;
  contractMonth?: string;
  from?: string;
  to?: string;
  fields?: string;
  timeframe?: string;
}

export interface RestFutOptHistoricalCandlesResponse {
  symbol: string;
  contractMonth?: string;
  exchange: string;
  timeframe: string;
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    turnover: number;
    change: number;
  }>;
}


export const candles = (request: RestClientRequest, params: RestFutOptHistoricalCandlesParams) => {
  const { symbol, ...options } = params;
  return request(`historical/candles/${symbol}`, options) as Promise<RestFutOptHistoricalCandlesResponse>;
}

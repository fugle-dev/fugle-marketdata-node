import { RestClientRequest } from "../../client";

export interface RestFutOptHistoricalDailyParams {
  symbol: string;
  date?: string;
  afterhours?: boolean;
}

export interface RestFutOptHistoricalDailyResponse {
  date: string;
  symbol: string;
  exchange: string;
  session: string;
  data: Array<{
    contractMonth: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    change: number;
    changePercent: number;
    volume: number;
    volumeSpread: number;
    openInterest: number;
    settlementPrice: number;
  }>;
}

export const daily = (request: RestClientRequest, params: RestFutOptHistoricalDailyParams) => {
  const { symbol, ...options } = params;
  return request(`historical/daily/${symbol}`, options) as Promise<RestFutOptHistoricalDailyResponse>;
}

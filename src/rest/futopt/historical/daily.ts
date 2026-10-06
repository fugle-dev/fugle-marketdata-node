import { RestClientRequest } from "../../client";

interface RestFutOptHistoricalDailyBaseParams {
  date?: string;
  contractMonth?: string;
  session?: 'afterhours';
}

export type RestFutOptHistoricalDailyParams = RestFutOptHistoricalDailyBaseParams & (
  | { product: string; symbol?: never }
  /** @deprecated Use `product` instead. */
  | { symbol: string; product?: never }
);

export interface RestFutOptHistoricalDailyResponse {
  date: string;
  product: string;
  exchange: string;
  session: string;
  /** Present only when requested; resolved to the actual month for continuous aliases like `1!`. */
  contractMonth?: string;
  data: Array<{
    contractMonth: string;
    /** `null` for futures and spreads. */
    strikePrice: number | null;
    /** `null` for futures and spreads. */
    callPut: 'CALL' | 'PUT' | null;
    exchange: string;
    /** Price fields are `null` for rows without trades. */
    openPrice: number | null;
    highPrice: number | null;
    lowPrice: number | null;
    closePrice: number | null;
    change: number | null;
    changePercent: number | null;
    volume: number;
    /** Spread-to-single volume; set on spread rows only, `null` on other futures rows and absent on options. */
    volumeSpread?: number | null;
    /** `null` for spreads and the after-hours session. */
    openInterest: number | null;
    /** `null` for spreads and the after-hours session. */
    settlementPrice: number | null;
  }>;
}

export const daily = (request: RestClientRequest, params: RestFutOptHistoricalDailyParams) => {
  const { product, symbol, ...options } = params;
  const code = (product ?? symbol) as string;
  return request(`historical/daily/${encodeURIComponent(code)}`, options) as Promise<RestFutOptHistoricalDailyResponse>;
}

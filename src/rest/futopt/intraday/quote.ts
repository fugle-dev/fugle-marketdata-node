import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayQuoteParams {
  symbol: string;
  session?: 'afterhours';
}

export interface RestFutOptIntradayQuoteResponse {
  date: string;
  type: string;
  exchange: string;
  market: string;
  symbol: string;
  openPrice: number;
  openTime: number;
  highPrice: number;
  highTime: number;
  lowPrice: number;
  lowTime: number;
  closePrice: number;
  closeTime: number;
  lastPrice: number;
  avgPrice: number;
  change: number;
  changePercent: number;
  amplitude: number;
  lastSize: number;
  bids: Array<{
    price: number;
    size: number;
  }>;
  asks: Array<{
    price: number;
    size: number;
  }>;
  total: {
    tradeValue: number;
    tradeVolume: number;
    tradeVolumeAtBid: number;
    tradeVolumeAtAsk: number;
    transaction: number;
    time: number;
  };
  priceLimits: {
    price: number;
    bid: number;
    ask: number;
    curb: number;
  };
  lastTrade: {
    bid: number;
    ask: number;
    price: number;
    size: number;
    time: number;
    serial: number;
  };
  /** Last trial match (試撮); absent outside a trial session. */
  lastTrial?: {
    bid: number;
    ask: number;
    price: number;
    size: number;
    time: number;
    serial: number;
  };
  tradingHalt: {
    isHalted: boolean;
    time: number;
  };
  /**
   * Marks the quote as trial-matching (試撮) — a simulated match, not a trade.
   * Omitted rather than sent as `false` outside a trial session, during which
   * `lastPrice` / `lastSize` are the trial values.
   */
  isTrial?: boolean;
  isDelayedOpen: boolean;
  isDelayedClose: boolean;
  isContinuous: boolean;
  isOpen: boolean;
  isClose: boolean;
  serial: number;
  lastUpdated: number;
}

export const quote = (request: RestClientRequest, params: RestFutOptIntradayQuoteParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/quote/${encodeURIComponent(symbol)}`, options) as Promise<RestFutOptIntradayQuoteResponse>;
}

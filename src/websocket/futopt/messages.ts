import { RestFutOptIntradayQuoteResponse } from '../../rest/futopt/intraday/quote';

/**
 * Shapes of the futopt streaming frames, for casting the raw string handed to
 * the `message` event after `JSON.parse`.
 *
 * `isTrial` is the field to branch on before acting on a price: it marks a
 * trial-matching (試撮) quote, which is a simulated match and not a trade. The
 * server omits it entirely when false rather than sending `isTrial: false`,
 * hence `?: true`.
 *
 * Trial frames on `trades` / `books` only reach clients connected to futopt
 * streaming v1.1. They are *not* the only place trial data surfaces, though:
 * `aggregates` is not version-gated, and during a trial session its
 * `lastPrice` / `lastSize` are the trial values on every version — only the
 * top-level `isTrial` distinguishes them.
 */
export interface WebSocketFutOptTrade {
  bid?: number;
  ask?: number;
  price?: number;
  size?: number;
  time?: number;
  serial?: string;
  isReplaced?: boolean;
}

export interface WebSocketFutOptTradesData {
  symbol: string;
  type: string;
  exchange: string;
  trades: WebSocketFutOptTrade[];
  total: {
    bidOrders?: number;
    askOrders?: number;
    bidVolume?: number;
    askVolume?: number;
    tradeValue?: number;
    tradeVolume?: number;
    totalBidMatch?: number;
    totalAskMatch?: number;
    tradeVolumeAtBid?: number;
    tradeVolumeAtAsk?: number;
    transaction?: number;
    time?: number;
  };
  isTrial?: true;
  time: number;
  serial: number;
}

export interface WebSocketFutOptBooksData {
  symbol: string;
  type: string;
  exchange: string;
  bids?: Array<{
    price?: number;
    size?: number;
  }>;
  asks?: Array<{
    price?: number;
    size?: number;
  }>;
  /** Extended (6th) order-book level, present on some contracts. */
  derivedBid?: {
    price?: number;
    size?: number;
  };
  derivedAsk?: {
    price?: number;
    size?: number;
  };
  isTrial?: true;
  time?: number;
  serial?: number;
}

/**
 * The `aggregates` frame carries the same aggregated quote the REST
 * `intraday/quote` endpoint returns — the server writes one object to both.
 */
export type WebSocketFutOptAggregatesData = RestFutOptIntradayQuoteResponse;

export interface WebSocketFutOptMessage<T> {
  event: string;
  data: T;
  id: string;
  channel: string;
}

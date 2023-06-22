import { RestClientRequest } from '../../client';

export interface RestStockIntradayQuoteParams {
  symbol: string;
  type?: 'oddlot';
}

export interface RestStockIntradayQuoteResponse {
  date: string;
  type: string;
  exchange: string;
  market: string;
  symbol: string;
  name: string;
  openPrice: number;
  openTime: number;
  highPrice: number;
  highTime: number;
  lowPrice: number;
  lowTime: number;
  closePrice: number;
  closeTime: number;
  lastPrice: number;
  lastSize: number;
  avgPrice: number;
  change: number;
  changePercent: number;
  amplitude: number;
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
  lastTrade: {
    bid: number;
    ask: number;
    price: number;
    size: number;
    time: number;
  };
  lastTrial: {
    bid: number;
    ask: number;
    price: number;
    size: number;
    time: number;
  };
  opHaltStatus: {
    isHalted: boolean;
    time: number;
  };
  isLimitDownPrice: boolean,
  isLimitUpPrice: boolean,
  isLimitDownBid: boolean,
  isLimitUpBid: boolean,
  isLimitDownAsk: boolean,
  isLimitUpAsk: boolean,
  isLimitDownHalt: boolean,
  isLimitUpHalt: boolean,
  isTrial: boolean;
  isDelayedOpen: boolean;
  isDelayedClose: boolean;
  isContinuous: boolean;
  isOpen: boolean;
  isClose: boolean;
  lastUpdated: number;
}

export const quote = (request: RestClientRequest, params: RestStockIntradayQuoteParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/quote/${symbol}`, options) as Promise<RestStockIntradayQuoteResponse>;
}

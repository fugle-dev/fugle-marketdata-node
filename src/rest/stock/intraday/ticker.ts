import { RestClientRequest } from '../../client';

export interface RestStockIntradayTickerParams {
  symbol: string;
  type?: 'oddlot';
}

export interface RestStockIntradayTickerResponse {
  date: string;
  type: string;
  exchange: string;
  market: string;
  symbol: string;
  name: string;
  nameEn: string;
  industry: string;
  securityType: string;
  referencePrice: number;
  limitUpPrice: number;
  limitDownPrice: number;
  canDayTrade: boolean;
  canBuyDayTrade: boolean;
  canBelowFlatMarginShortSell: boolean;
  canBelowFlatSBLShortSell: boolean;
  isAttention: boolean;
  isDisposition: boolean;
  isUnusuallyRecommended: boolean;
  isSpecificAbnormally: boolean;
  matchingInterval: number;
  securityStatus: string;
  boardLot: number;
  tradingCurrency: string;
  exercisePrice: number;
  exercisedVolume: number;
  cancelledVolume: number;
  remainingVolume: number;
  exerciseRatio: number;
  capPrice: number;
  floorPrice: number;
  maturityDate: string;
  previousClose: number;
  openTime: string;
  closeTime: string;
  isNewlyCompiled: boolean;
}

export const ticker = (request: RestClientRequest, params: RestStockIntradayTickerParams) => {
  const { symbol, ...options } = params;
  return request(`intraday/ticker/${symbol}`, options) as Promise<RestStockIntradayTickerResponse>;
}

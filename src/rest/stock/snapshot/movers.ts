import { RestClientRequest } from '../../client';

export interface RestStockSnapshotMoversParams {
  market: 'TSE' | 'OTC' | 'ESB' | 'TIB' | 'PSB';
  direction: 'up' | 'down';
  change: 'percent' | 'value';
  type?: 'ALL' | 'ALLBUT0999' | 'COMMONSTOCK';
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  eq?: number;
}

export interface RestStockSnapshotMoversResponse {
  date: string,
  time: string,
  market: string,
  data: Array<{
    type: string,
    symbol: string,
    name:string
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    change: number;
    changePercent: number;
    tradeVolume: number;
    tradeValue: number;
    lastUpdated: number;
  }>;
}

export const movers = (request: RestClientRequest, params: RestStockSnapshotMoversParams) => {
  const { market, ...options } = params;
  return request(`snapshot/movers/${market}`, options) as Promise<RestStockSnapshotMoversResponse>;
}

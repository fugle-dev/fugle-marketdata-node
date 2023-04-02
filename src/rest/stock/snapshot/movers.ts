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
    symbol: string,
    open: number;
    high: number;
    low: number;
    close: number;
    change: number;
    changePercent: number;
    tradeVolume: number;
    tradeValue: number;
    timestamp: number;
  }>;
}

export const movers = (request: RestClientRequest, params: RestStockSnapshotMoversParams) => {
  const { market, ...options } = params;
  return request(`snapshot/movers/${market}`, options) as Promise<RestStockSnapshotMoversResponse>;
}

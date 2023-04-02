import { RestClientRequest } from '../../client';

export interface RestStockSnapshotQuotesParams {
  market: 'TSE' | 'OTC' | 'ESB' | 'TIB' | 'PSB';
  type?: 'ALL' | 'ALLBUT0999' | 'COMMONSTOCK';
}

export interface RestStockSnapshotQuotesResponse {
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

export const quotes = (request: RestClientRequest, params: RestStockSnapshotQuotesParams) => {
  const { market, ...options } = params;
  return request(`snapshot/quotes/${market}`, options) as Promise<RestStockSnapshotQuotesResponse>;
}

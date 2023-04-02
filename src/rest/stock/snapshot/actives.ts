import { RestClientRequest } from '../../client';

export interface RestStockSnapshotActivesParams {
  market: 'TSE' | 'OTC' | 'ESB' | 'TIB' | 'PSB';
  trade: 'volume' | 'value';
  type?: 'ALL' | 'ALLBUT0999' | 'COMMONSTOCK';
}

export interface RestStockSnapshotActivesResponse {
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

export const actives = (request: RestClientRequest, params: RestStockSnapshotActivesParams) => {
  const { market, ...options } = params;
  return request(`snapshot/actives/${market}`, options) as Promise<RestStockSnapshotActivesResponse>;
}

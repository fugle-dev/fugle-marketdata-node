import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayTickersParams {
  type: 'FUTURE' | 'OPTION';
  exchange?: 'TAIFEX';
  session?: 'REGULAR' | 'AFTERHOURS';
  product?: string;
  contractType?: 'I' | 'R' | 'B' | 'C' | 'S' | 'E';
}

export interface RestFutOptIntradayTickersResponse {
  type: string;
  exchange: string;
  session: string;
  product?: string;
  contractType?: string;
  data: Array<{
    type: string;
    contractType: string;
    symbol: string;
    name: string;
    isDynamicBanding: boolean;
    openTime: string;
    closeTime: string;
    startDate: string;
    endDate: string;
    settlementDate: string;
  }>;
}

export const tickers = (request: RestClientRequest, params: RestFutOptIntradayTickersParams) => {
  return request('intraday/tickers', params) as Promise<RestFutOptIntradayTickersResponse>;
}

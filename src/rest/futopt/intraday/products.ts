import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayProductsParams {
  type: 'FUTURE' | 'OPTION';
  exchange?: 'TAIFEX';
  session?: 'REGULAR' | 'AFTERHOURS';
  contractType?: 'I' | 'R' | 'B' | 'C' | 'S' | 'E';
}

export interface RestFutOptIntradayProductsResponse {
  date: string;
  type: string;
  exchange: string;
  session: string;
  contractType: string;
  data: Array<{
    type: string;
    exchange: string;
    symbol: string;
    name: string;
    referencePrice: number;
    contractType: string;
    startDate: string;
    endDate: string;
    flowGroup: number;
    settlementDate: string;
    isDynamicBanding: boolean;
  }>;
}

export const products = (request: RestClientRequest, params: RestFutOptIntradayProductsParams) => {
  return request(`intraday/products`, params) as Promise<RestFutOptIntradayProductsResponse>;
}

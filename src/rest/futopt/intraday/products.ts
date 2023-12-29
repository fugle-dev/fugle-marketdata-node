import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayProductsParams {
  type: 'FUTURE' | 'OPTION';
  exchange?: 'TAIFEX';
  session?: 'REGULAR' | 'AFTERHOURS';
  contractType?: 'I' | 'R' | 'B' | 'C' | 'S' | 'E';
  status?: 'N' | 'P' | 'U';
}

export interface RestFutOptIntradayProductsResponse {
  date: string;
  type: string;
  session: string;
  contractType: string;
  status: string;
  data: Array<{
    type: string;
    exchange: string;
    symbol: string;
    name: string;
    underlyingSymbol: string;
    contractType: string;
    contractSize: number;
    statusCode: string;
    tradingCurrency: string;
    quoteAcceptable: true,
    startDate: string;
    canBlockTrade: true,
    expiryType: string;
    underlyingType: string;
    marketCloseGroup: number;
    endSession: number;
  }>;
}

export const products = (request: RestClientRequest, params: RestFutOptIntradayProductsParams) => {
  return request(`intraday/products`, params) as Promise<RestFutOptIntradayProductsResponse>;
}

import { RestClientRequest } from '../../client';

export interface RestFutOptIntradayContractsParams {
  type: 'FUTURE' | 'OPTION';
  exchange?: 'TAIFEX';
  session?: 'REGULAR' | 'AFTERHOURS';
  contractType?: 'I' | 'R' | 'B' | 'C' | 'S' | 'E';
  status?: 'N' | 'P' | 'U';
}

export interface RestFutOptIntradayContractsResponse {
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

export const contracts = (request: RestClientRequest, params: RestFutOptIntradayContractsParams) => {
  return request(`intraday/contracts`, params) as Promise<RestFutOptIntradayContractsResponse>;
}

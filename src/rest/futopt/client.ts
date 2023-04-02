import { RestClient } from '../client';
import { RestFutOptIntradayContractsParams, contracts } from './intraday/contracts';
import { RestFutOptIntradayProductsParams, products } from './intraday/products';

export class RestFutOptClient extends RestClient {
  get intraday() {
    const request = this.request;
    return {
      contracts: (params: RestFutOptIntradayContractsParams) => contracts(request, params),
      products: (params: RestFutOptIntradayProductsParams) => products(request, params),
    };
  }
}

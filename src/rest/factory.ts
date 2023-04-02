import { RestClient } from './client';
import { RestStockClient } from './stock/client';
import { RestFutOptClient } from './futopt/client';
import { ClientFactory } from '../client-factory';
import { FUGLE_MARKETDATA_API_REST_BASE_URL, FUGLE_MARKETDATA_API_VERSION } from '../constants';

export class RestClientFactory extends ClientFactory {
  private readonly clients = new Map<string, RestClient>();

  get stock() {
    return this.getClient('stock');
  }

  get futopt() {
    return this.getClient('futopt');
  }

  private getClient(type: 'stock' | 'futopt') {
    let client = this.clients.get(type);

    if (!client) {
      const baseUrl = `${FUGLE_MARKETDATA_API_REST_BASE_URL}/${FUGLE_MARKETDATA_API_VERSION}/${type}`;

      /* istanbul ignore else */
      if (type === 'stock') {
        client = new RestStockClient({ ...this.options, baseUrl });
      } else if (type === 'futopt') {
        client = new RestFutOptClient({ ...this.options, baseUrl });
      } else {
        throw new TypeError('invalid client type');
      }

      this.clients.set(type, client);
    }

    return client;
  }
}

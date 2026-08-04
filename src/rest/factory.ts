import { RestClient } from './client';
import { RestStockClient } from './stock/client';
import { RestFutOptClient } from './futopt/client';
import { ClientFactory } from '../client-factory';
import { withVersion } from '../base-url';
import { FUGLE_MARKETDATA_API_REST_BASE_URL, FUGLE_MARKETDATA_API_VERSION } from '../constants';

export class RestClientFactory extends ClientFactory {
  private readonly clients = new Map<string, RestClient>();

  get stock() {
    return this.getClient('stock') as RestStockClient;
  }

  get futopt() {
    return this.getClient('futopt') as RestFutOptClient;
  }

  private getClient(type: 'stock' | 'futopt') {
    let client = this.clients.get(type);

    if (!client) {
      // Same rule as streaming: baseUrl is host and path prefix, the SDK owns
      // the version segment. REST serves one version, so there's no option to
      // choose it with — but a version written into baseUrl is still rejected
      // rather than silently doubled.
      const baseUrl = withVersion(
        this.options.baseUrl || FUGLE_MARKETDATA_API_REST_BASE_URL,
        FUGLE_MARKETDATA_API_VERSION,
      );
      const url = `${baseUrl}/${type}`;

      /* istanbul ignore else */
      if (type === 'stock') {
        client = new RestStockClient({ ...this.options, baseUrl: url });
      } else if (type === 'futopt') {
        client = new RestFutOptClient({ ...this.options, baseUrl: url });
      } else {
        throw new TypeError('invalid client type');
      }

      this.clients.set(type, client);
    }

    return client;
  }
}

import { WebSocketClient } from './client';
import { WebSocketStockClient } from './stock/client';
import { WebSocketFutOptClient } from './futopt/client';
import { WebSocketProduct, VERSION_OPTION_HINT, resolveVersion } from './version';
import { FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL } from '../constants';
import { ClientFactory } from '../client-factory';
import { withVersion } from '../base-url';

export class WebSocketClientFactory extends ClientFactory {
  private readonly clients = new Map<string, WebSocketClient>();

  get stock() {
    return this.getClient('stock') as WebSocketStockClient;
  }

  get futopt() {
    return this.getClient('futopt') as WebSocketFutOptClient;
  }

  /**
   * `baseUrl` picks the host and path prefix; `version` picks the version.
   * Nothing else: a custom endpoint is written the same way as the public one,
   * and pointing at a different host never forces the caller to track versions
   * by hand.
   */
  private resolveBaseUrl(type: WebSocketProduct) {
    const version = resolveVersion(type, this.options.version);
    const baseUrl = this.options.baseUrl || FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL;
    return withVersion(baseUrl, version, VERSION_OPTION_HINT);
  }

  private getClient(type: WebSocketProduct) {
    let client = this.clients.get(type);

    if (!client) {
      const baseUrl = this.resolveBaseUrl(type);
      const url = `${baseUrl.replace(/\/+$/, '')}/${type}/streaming`;

      /* istanbul ignore else */
      if (type === 'stock') {
        client = new WebSocketStockClient({ ...this.options, url });
      } else if (type === 'futopt') {
        client = new WebSocketFutOptClient({ ...this.options, url });
      } else {
        throw new TypeError('invalid client type');
      }

      this.clients.set(type, client);
    }

    return client;
  }
}

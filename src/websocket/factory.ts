import { WebSocketClient } from './client';
import { WebSocketStockClient } from './stock/client';
import { WebSocketFutOptClient } from './futopt/client';
import { WebSocketProduct, applyVersionToBaseUrl, resolveVersion } from './version';
import { FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL } from '../constants';
import { ClientFactory } from '../client-factory';

export class WebSocketClientFactory extends ClientFactory {
  private readonly clients = new Map<string, WebSocketClient>();

  get stock() {
    return this.getClient('stock') as WebSocketStockClient;
  }

  get futopt() {
    return this.getClient('futopt') as WebSocketFutOptClient;
  }

  /**
   * A `baseUrl` is only re-versioned when `version` was explicitly supplied.
   * Left alone otherwise, the version the caller wrote into their URL wins —
   * which keeps custom and internal deployments (whose paths need not follow
   * the public versioning at all) working exactly as before.
   */
  private resolveBaseUrl(type: WebSocketProduct) {
    const version = resolveVersion(type, this.options.version);

    if (!this.options.baseUrl) {
      return `${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${version}`;
    }

    return this.options.version !== undefined
      ? applyVersionToBaseUrl(this.options.baseUrl, version)
      : this.options.baseUrl;
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

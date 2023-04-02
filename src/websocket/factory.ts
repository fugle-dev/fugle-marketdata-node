import { WebSocketClient } from './client';
import { WebSocketStockClient } from './stock/client';
import { FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL, FUGLE_MARKETDATA_API_VERSION } from '../constants';
import { ClientFactory } from '../client-factory';

export class WebSocketClientFactory extends ClientFactory {
  private readonly clients = new Map<string, WebSocketClient>();

  get stock() {
    return this.getClient('stock');
  }

  private getClient(type: 'stock' | 'futopt') {
    let client = this.clients.get(type);

    if (!client) {
      const url = `${FUGLE_MARKETDATA_API_WEBSOCKET_BASE_URL}/${FUGLE_MARKETDATA_API_VERSION}/${type}/streaming`;

      /* istanbul ignore else */
      if (type === 'stock') {
        client = new WebSocketStockClient({ ...this.options, url });
      } else {
        throw new TypeError('invalid client type');
      }

      this.clients.set(type, client);
    }

    return client;
  }
}

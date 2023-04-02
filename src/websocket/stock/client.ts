import { WebSocketClient } from '../client';

type Channel = 'trades' | 'books' | 'candles' | 'aggregates';

export class WebSocketStockClient extends WebSocketClient {

  public subscribe(params: { channel: Channel, [key: string]: any }) {
    super.subscribe(params);
  }
}

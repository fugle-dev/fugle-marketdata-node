import { WebSocketClient } from '../client';

type Channel = 'trades' | 'books';

export class WebSocketFutOptClient extends WebSocketClient {

  public subscribe(params: { channel: Channel, [key: string]: any }) {
    super.subscribe(params);
  }
}

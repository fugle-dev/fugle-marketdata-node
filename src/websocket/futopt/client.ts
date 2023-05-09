import { WebSocketClient } from '../client';

export interface WebSocketFutOptSubscribeParams {
  channel: 'trades' | 'books' | 'candles';
  symbol?: string;
  symbols?: string[];
  afterHours?: boolean;
}

export interface WebSocketFutOptUnsubscribeParams {
  id?: string;
  ids?: string[];
}

export class WebSocketFutOptClient extends WebSocketClient {

  public subscribe(params: WebSocketFutOptSubscribeParams) {
    super.subscribe(params);
  }

  public unsubscribe(params: WebSocketFutOptUnsubscribeParams) {
    super.unsubscribe(params);
  }
}

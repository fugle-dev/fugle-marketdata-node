import { WebSocketClient } from '../client';

export interface WebSocketStockSubscribeParams {
  channel: 'trades' | 'books' | 'candles' | 'aggregates';
  symbol?: string;
  symbols?: string[];
  intradayOddLot?: boolean;
}

export interface WebSocketStockUnsubscribeParams {
  id?: string;
  ids?: string[];
}

export class WebSocketStockClient extends WebSocketClient {

  public subscribe(params: WebSocketStockSubscribeParams) {
    super.subscribe(params);
  }

  public unsubscribe(params: WebSocketStockUnsubscribeParams) {
    super.unsubscribe(params);
  }
}

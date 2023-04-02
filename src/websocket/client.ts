import * as events from 'events';
import * as WebSocket from 'isomorphic-ws';
import { CONNECT_EVENT, DISCONNECT_EVENT, MESSAGE_EVENT, ERROR_EVENT, AUTHENTICATED_EVENT, UNAUTHENTICATED_EVENT, UNAUTHENTICATED_MESSAGE } from '../constants';

export interface WebSocketClientOptions {
  url: string;
  apiKey?: string;
  bearerToken?: string;
}

export class WebSocketClient extends events.EventEmitter {
  private socket!: WebSocket;

  constructor(protected readonly options: WebSocketClientOptions) {
    super();
  }

  public connect() {
    this.socket = new WebSocket(this.options.url);
    this.socket.onopen = () => this.emit(CONNECT_EVENT);
    this.socket.onmessage = event => this.emit(MESSAGE_EVENT, event.data);
    this.socket.onerror = event => this.emit(ERROR_EVENT, event.error);
    this.socket.onclose = () => this.emit(DISCONNECT_EVENT);
    this.on(CONNECT_EVENT, () => this.authenticate());
    this.on(MESSAGE_EVENT, message => this.handleMessage(message));

    return new Promise((resolve, reject) => {
      this.on(AUTHENTICATED_EVENT, (data) => resolve(data));
      this.on(UNAUTHENTICATED_EVENT, (data) => reject(data));
    });
  }

  public disconnect() {
    this.socket.close();
  }

  public subscribe(params: { channel: string, [key: string]: any }) {
    this.send({ event: 'subscribe', data: params });
  }

  private authenticate() {
    if (this.options.apiKey) {
      this.send({ event: 'auth', data: { apikey: this.options.apiKey } });
    }
    if (this.options.bearerToken) {
      this.send({ event: 'auth', data: { token: this.options.bearerToken } });
    }
  }

  private send(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  private handleMessage(message: string) {
    try {
      const { event, data } = JSON.parse(message) as Record<string, any>;

      if (event === AUTHENTICATED_EVENT) {
        this.emit(AUTHENTICATED_EVENT, data);
      }
      if (event === ERROR_EVENT) {
        if (data && data.message === UNAUTHENTICATED_MESSAGE) {
          this.emit(UNAUTHENTICATED_EVENT, data);
        }
      }
    } catch (err) {}
  }
}

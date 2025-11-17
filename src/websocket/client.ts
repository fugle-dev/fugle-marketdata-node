import * as events from 'events';
import * as WebSocket from 'isomorphic-ws';
import { CONNECT_EVENT, DISCONNECT_EVENT, MESSAGE_EVENT, ERROR_EVENT, AUTHENTICATED_EVENT, UNAUTHENTICATED_EVENT, UNAUTHENTICATED_MESSAGE } from '../constants';

export interface HealthCheckConfig {
  enabled: boolean;
  pingInterval?: number;
  maxMissedPongs?: number;
}

export interface WebSocketClientOptions {
  url: string;
  apiKey?: string;
  bearerToken?: string;
  sdkToken?: string;
  healthCheck?: HealthCheckConfig;
}

export class WebSocketClient extends events.EventEmitter {
  private socket!: WebSocket;
  private missedPongs = 0;
  private pingTimerId: ReturnType<typeof setTimeout> | undefined;

  constructor(protected readonly options: WebSocketClientOptions) {
    super();
  }

  public connect() {
    this.socket = new WebSocket(this.options.url);
    this.socket.onopen = () => this.emit(CONNECT_EVENT);
    this.socket.onmessage = event => this.emit(MESSAGE_EVENT, event.data);
    this.socket.onerror = event => this.emit(ERROR_EVENT, event.error);
    this.socket.onclose = event => this.emit(DISCONNECT_EVENT, event);
    this.on(CONNECT_EVENT, () => this.authenticate());
    this.on(MESSAGE_EVENT, message => this.handleMessage(message));

    return new Promise((resolve, reject) => {
      this.on(AUTHENTICATED_EVENT, (data) => resolve(data));
      this.on(UNAUTHENTICATED_EVENT, (data) => reject(data));
    });
  }

  public disconnect() {
    this.socket.close();
    if (this.pingTimerId) {
      clearInterval(this.pingTimerId);
    }
  }

  private detectConnectionStatus(state?: string) {
    if (!this.options.healthCheck?.enabled) return;

    try {
      this.ping({ state });
      this.missedPongs += 1;
      const maxMissed = this.options.healthCheck.maxMissedPongs ?? 2;
      if (this.missedPongs > maxMissed) {
        this.disconnect();
        return;
      }
    } catch (error) {
      console.error(`Failed to send ping: ${error}`);
      this.disconnect();
      return;
    }
  }

  public subscribe(params: { channel: string, [key: string]: any }) {
    this.send({ event: 'subscribe', data: params });
  }

  public unsubscribe(params: { id?: string, ids?: string[] }) {
    this.send({ event: 'unsubscribe', data: params });
  }

  public ping(params: { state?: any }) {
    this.send({ event: 'ping', data: params });
  }

  public subscriptions() {
    this.send({ event: 'subscriptions' });
  }

  private authenticate() {
    if (this.options.apiKey) {
      this.send({ event: 'auth', data: { apikey: this.options.apiKey } });
    }
    if (this.options.bearerToken) {
      this.send({ event: 'auth', data: { token: this.options.bearerToken } });
    }
    if (this.options.sdkToken) {
      this.send({ event: 'auth', data: { sdkToken: this.options.sdkToken } });
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

        // Start health check if enabled
        if (this.options.healthCheck?.enabled) {
          const interval = this.options.healthCheck.pingInterval ?? 30000;
          this.pingTimerId = setInterval(() => {
            this.detectConnectionStatus();
          }, interval);
        }
      }
      if (event === ERROR_EVENT) {
        if (data && data.message === UNAUTHENTICATED_MESSAGE) {
          this.emit(UNAUTHENTICATED_EVENT, data);
        }
      }
      if (event === 'pong') {
        this.missedPongs = 0;
      }
    } catch (err) {}
  }
}

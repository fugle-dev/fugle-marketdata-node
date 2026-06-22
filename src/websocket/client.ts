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

export interface DisconnectReason {
  reason: 'health-check-timeout';
}

export class WebSocketClient extends events.EventEmitter {
  private socket!: WebSocket;
  private consecutiveMisses = 0;
  private lastMessageAt = 0;
  private lastPingAt = 0;
  private pingTimerId: ReturnType<typeof setTimeout> | undefined;
  private pendingDisconnectReason: DisconnectReason | undefined;

  constructor(protected readonly options: WebSocketClientOptions) {
    super();
  }

  public connect() {
    this.socket = new WebSocket(this.options.url);
    this.socket.onopen = () => this.emit(CONNECT_EVENT);
    this.socket.onmessage = event => {
      // Any inbound message counts as freshness.
      this.lastMessageAt = Date.now();
      this.emit(MESSAGE_EVENT, event.data);
    };
    this.socket.onerror = event => this.emit(ERROR_EVENT, event.error);
    this.socket.onclose = event => {
      const reason = this.pendingDisconnectReason;
      this.pendingDisconnectReason = undefined;
      this.emit(DISCONNECT_EVENT, event, reason);
    };
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
      this.pingTimerId = undefined;
    }
  }

  private detectConnectionStatus() {
    if (!this.options.healthCheck?.enabled) return;

    const maxMissed = this.options.healthCheck.maxMissedPongs ?? 2;

    // Freshness check: did anything arrive since our last ping?
    if (this.lastMessageAt < this.lastPingAt) {
      this.consecutiveMisses += 1;
    } else {
      this.consecutiveMisses = 0;
    }

    if (this.consecutiveMisses >= maxMissed) {
      this.pendingDisconnectReason = { reason: 'health-check-timeout' };
      this.disconnect();
      return;
    }

    try {
      this.ping({});
      this.lastPingAt = Date.now();
    } catch (error) {
      console.error(`Failed to send ping: ${error}`);
      this.pendingDisconnectReason = { reason: 'health-check-timeout' };
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
          this.consecutiveMisses = 0;
          // Seed timestamps so the first tick treats the connection as fresh.
          const now = Date.now();
          this.lastMessageAt = now;
          this.lastPingAt = now;
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
    } catch (err) {}
  }
}

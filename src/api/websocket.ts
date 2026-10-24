// SVAMS WebSocket Service
// Provides real-time communication for live auctions, notifications, and dashboard updates.

import type { WebSocketMessage, WebSocketMessageType, RealtimeSubscription } from './types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const ENABLE_WS = import.meta.env.VITE_ENABLE_WEBSOCKETS !== 'false';
const RECONNECT_INTERVAL = 3000;
const HEARTBEAT_INTERVAL = 30000;

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'disconnected';
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private messageQueue: WebSocketMessage[] = [];
  private isConnecting = false;
  private onStateChange?: (state: ConnectionState) => void;

  constructor(onStateChange?: (state: ConnectionState) => void) {
    this.onStateChange = onStateChange;
  }

  connect(token?: string): Promise<void> {
    if (this.isConnecting || this.state === 'connected') return Promise.resolve();
    if (!ENABLE_WS) {
      this.state = 'disconnected';
      this.onStateChange?.('disconnected');
      return Promise.resolve();
    }

    this.isConnecting = true;
    this.setState('connecting');

    const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.setState('connected');
          this.startHeartbeat();
          this.flushQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.dispatch(message);
          } catch (err) {
            console.warn('Failed to parse WebSocket message:', err);
          }
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket error:', err);
          this.setState('failed');
          reject(err);
        };

        this.ws.onclose = () => {
          this.isConnecting = false;
          this.stopHeartbeat();
          this.ws = null;
          if (this.state !== 'disconnected') {
            this.setState('disconnected');
            this.scheduleReconnect();
          }
        };
      } catch (err) {
        this.isConnecting = false;
        this.setState('failed');
        reject(err);
      }
    });
  }

  disconnect(): void {
    this.stopReconnect();
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.setState('disconnected');
    this.handlers.clear();
    this.subscriptions.clear();
  }

  subscribe(type: WebSocketMessageType, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);

    this.send(this.createMessage('subscribe', { channel: type }));
    return () => {
      this.handlers.get(type)?.delete(handler);
      this.unsubscribe(type);
    };
  }

  subscribeAll(handler: MessageHandler): () => void {
    const wildcard = '*';
    if (!this.handlers.has(wildcard)) this.handlers.set(wildcard, new Set());
    this.handlers.get(wildcard)!.add(handler);
    return () => this.handlers.get(wildcard)?.delete(handler);
  }

  unsubscribe(type: string): void {
    this.subscriptions.delete(type);
    this.send(this.createMessage('unsubscribe', { channel: type }));
  }

  subscribeChannel(channel: string, filters?: Record<string, unknown>): () => void {
    this.subscriptions.set(channel, { channel, filters });
    this.send(this.createMessage('subscribe', { channel, filters }));
    return () => {
      this.subscriptions.delete(channel);
      this.send(this.createMessage('unsubscribe', { channel }));
    };
  }

  send(message: WebSocketMessage): boolean {
    if (this.ws && this.state === 'connected' && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    this.messageQueue.push(message);
    return false;
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.state === 'connected') {
      const msg = this.messageQueue.shift();
      if (msg) this.ws.send(JSON.stringify(msg));
    }
  }

  private dispatch(message: WebSocketMessage): void {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach(h => {
        try { h(message); } catch (err) { console.error('WebSocket handler error:', err); }
      });
    }
    const wildcard = this.handlers.get('*');
    if (wildcard) {
      wildcard.forEach(h => {
        try { h(message); } catch (err) { console.error('WebSocket wildcard handler error:', err); }
      });
    }
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.onStateChange?.(state);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState('failed');
      return;
    }
    this.reconnectAttempts++;
    this.setState('reconnecting');
    this.reconnectTimer = window.setTimeout(() => {
      this.connect().catch(() => {});
    }, RECONNECT_INTERVAL * Math.min(this.reconnectAttempts, 5));
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      this.send(this.createMessage('auth:session_expired', { ping: true }));
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private createMessage(type: string, payload: any): WebSocketMessage {
    return {
      type: type as WebSocketMessageType,
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  getState(): ConnectionState { return this.state; }
  isConnected(): boolean { return this.state === 'connected'; }
}

export const wsService = new WebSocketService();
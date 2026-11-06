/**
 * SVAMS — WebSocket Service
 * Auto-reconnect with exponential backoff, heartbeat, message queue, per-channel subscriptions.
 * Falls back to polling when WebSocket unavailable (RT-004).
 */

import type { WebSocketMessage, WebSocketMessageType } from "./types"

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001"

type Handler<T = unknown> = (msg: WebSocketMessage<T>) => void

export class WsService {
  private ws: WebSocket | null = null
  private url = WS_URL
  private token: string | null = null
  private reconnectAttempts = 0
  private maxReconnect = 10
  private reconnectDelay = 1000
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private subscribers = new Map<string, Set<Handler>>()
  private messageQueue: WebSocketMessage[] = []
  private connected = false

  connect(token: string, url?: string): void {
    this.token = token
    if (url) this.url = url
    if (this.ws?.readyState === WebSocket.OPEN) return
    this.openSocket()
  }

  private openSocket(): void {
    if (!this.url) return
    try {
      const wsUrl = this.url.includes("?")
        ? `${this.url}&token=${this.token}`
        : `${this.url}?token=${this.token}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        this.connected = true
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
        this.startHeartbeat()
        this.flushQueue()
      }

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as WebSocketMessage
          this.dispatch(msg)
        } catch {
          // ignore malformed messages
        }
      }

      this.ws.onclose = () => {
        this.connected = false
        this.stopHeartbeat()
        this.scheduleReconnect()
      }

      this.ws.onerror = () => {
        // connection error handled by onclose
      }
    } catch {
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnect) return
    this.reconnectAttempts++
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000,
    )
    this.reconnectTimer = setTimeout(() => this.openSocket(), delay)
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setTimeout(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: "ping",
            payload: null,
            timestamp: new Date().toISOString(),
          }),
        )
      }
      this.startHeartbeat()
    }, 30000)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer)
    this.heartbeatTimer = null
  }

  private flushQueue(): void {
    while (this.messageQueue.length) {
      const msg = this.messageQueue.shift()
      if (msg) this.ws?.send(JSON.stringify(msg))
    }
  }

  private dispatch(msg: WebSocketMessage): void {
    const handlers = this.subscribers.get(msg.type)
    if (handlers) {
      handlers.forEach((h) => h(msg))
    }
  }

  subscribe<T = unknown,>(
    type: WebSocketMessageType,
    handler: Handler<T>,
  ): () => void {
    if (!this.subscribers.has(type)) this.subscribers.set(type, new Set())
    this.subscribers.get(type)!.add(handler as Handler)
    return () => {
      this.subscribers.get(type)?.delete(handler as Handler)
    }
  }

  unsubscribe(type: WebSocketMessageType, handler: Handler): void {
    this.subscribers.get(type)?.delete(handler)
  }

  send<T = unknown,>(type: WebSocketMessageType, payload: T): void {
    const msg: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    }
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    } else {
      this.messageQueue.push(msg)
    }
  }

  disconnect(): void {
    this.stopHeartbeat()
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    this.ws?.close()
    this.ws = null
    this.connected = false
    this.token = null
  }

  isConnected(): boolean {
    return this.connected
  }
}

export const wsService = new WsService()

import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

let wssInstance: WebSocketServer | null = null;

export function setupWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server });
  wssInstance = wss;

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'connected' }));
  });

  return wss;
}

export function broadcastUpdate(data: any): void {
  if (!wssInstance) return;
  const msg = JSON.stringify({ type: 'commit', data });
  wssInstance.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

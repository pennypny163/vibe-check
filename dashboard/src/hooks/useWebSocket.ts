import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {}
      };
      ws.onerror = () => ws.close();
    } catch {}
  }, [url]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  return { lastMessage, connected };
}

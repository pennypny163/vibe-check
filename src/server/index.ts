import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupAPI } from './api.js';
import { setupWebSocket } from './ws.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function startServer(port: number = 3742): { close: () => void } {
  const app = express();
  app.use(express.json());

  // Serve dashboard static files
  const dashboardPath = path.join(__dirname, '../../dashboard/dist');
  app.use(express.static(dashboardPath));

  setupAPI(app);

  const server = createServer(app);
  const wss = setupWebSocket(server);

  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(dashboardPath, 'index.html'));
  });

  server.listen(port, '127.0.0.1', () => {
    // Server started silently
  });

  return {
    close: () => {
      wss.close();
      server.close();
    },
  };
}

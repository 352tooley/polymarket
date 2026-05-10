import Fastify from 'fastify';
import cors from '@fastify/cors';
import { WebSocketServer } from 'ws';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true
});

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'polymarket-server',
    version: '0.1.0'
  };
});

app.get('/markets', async () => {
  return [
    {
      id: 'election-2028',
      title: 'Will a Republican win the 2028 election?',
      probability: 58,
      volume: 124500
    },
    {
      id: 'btc-150k',
      title: 'Will Bitcoin hit $150k this year?',
      probability: 34,
      volume: 84500
    }
  ];
});

const PORT = 3847;

const server = await app.listen({
  port: PORT,
  host: '0.0.0.0'
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    socket.send(JSON.stringify({
      type: 'market_update',
      timestamp: Date.now(),
      payload: {
        market: 'btc-150k',
        probability: Math.floor(Math.random() * 100)
      }
    }));
  }, 3000);

  socket.on('close', () => {
    clearInterval(interval);
  });
});

console.log(`Polymarket backend running on http://localhost:${PORT}`);

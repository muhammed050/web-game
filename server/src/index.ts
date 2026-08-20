import http from 'node:http';
import express from 'express';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import { CityRoom } from './rooms/CityRoom.js';

const app = express();
app.get('/health', (_req, res) => res.json({ ok: true, service: 'neon-city-game-server', time: Date.now() }));
const httpServer = http.createServer(app);
const gameServer = new Server({ transport: new WebSocketTransport({ server: httpServer }) });
gameServer.define('city', CityRoom).enableRealtimeListing();
app.use('/monitor', monitor());
const port = Number(process.env.PORT || 2567);
httpServer.listen(port, () => console.log(`NEON CITY authoritative server listening on :${port}`));

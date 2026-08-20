# NEON CITY

A browser-based 3D open-world multiplayer game built with React, TypeScript, Vite, Three.js, React Three Fiber, Zustand and Supabase.

## Architecture

- **Client:** React + R3F + Zustand
- **Authoritative multiplayer:** Colyseus WebSocket server, 30Hz simulation, validated movement inputs
- **Persistence:** Supabase Auth/Postgres/RLS
- **Fallback realtime:** Supabase Presence when `VITE_GAME_SERVER_URL` is not configured
- **Mobile:** touch controls + landscape-friendly responsive HUD

## Development

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase URL and publishable/anon key.
3. Apply `supabase/schema.sql` to your Supabase project and enable Anonymous Auth for Quick Start.
4. Install client dependencies with `npm install`.
5. Run the client with `npm run dev`.
6. For authoritative multiplayer locally, run `npm run server:dev` in another terminal and set `VITE_GAME_SERVER_URL=ws://localhost:2567`.

## Server deployment

Deploy the `server/` directory as a persistent Node.js service (not a static Vercel frontend). Set `PORT` and expose the WebSocket endpoint. Then set the frontend `VITE_GAME_SERVER_URL` to the public `wss://...` endpoint.

## MVP

The playable MVP includes a 3D city, third-person movement, vehicle interaction, authoritative multiplayer room, remote-player interpolation, realtime chat, jobs, server-validated economy RPCs, profile persistence, responsive controls, map and mobile HUD.

## Inspiration / licensing

Architecture ideas were informed by public browser multiplayer projects such as `tech-leads-club/nj-mmo`, but NEON CITY code, branding, world and gameplay are original. Do not copy third-party assets unless their license permits redistribution.

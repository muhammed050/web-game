import { Client, Room } from 'colyseus.js';
import type { Remote, Vec } from '../store';

let room: Room<any> | null = null;

function endpoint() {
  const raw = (import.meta.env.VITE_GAME_SERVER_URL as string | undefined)?.trim();
  if (!raw) return null;
  return raw.replace(/^http/, 'ws').replace(/\/$/, '');
}

export async function connectCity(name: string, onPlayers: (players: Record<string, Remote>) => void) {
  const url = endpoint();
  if (!url) return null;
  const client = new Client(url);
  room = await client.joinOrCreate('city', { name });
  const sync = () => {
    const next: Record<string, Remote> = {};
    room?.state?.players?.forEach((p: any, id: string) => {
      if (id === room?.sessionId) return;
      next[id] = { id, name: p.name, position: { x: p.x, y: p.rotation, z: p.z }, rotation: p.rotation, vehicle: p.vehicle || undefined };
    });
    onPlayers(next);
  };
  room.state.players.onAdd((p: any, id: string) => {
    p.onChange(sync);
    sync();
  });
  room.state.players.onRemove((_p: any, id: string) => {
    const current = room?.state?.players;
    if (!current) return;
    sync();
  });
  sync();
  return room;
}

export function sendInput(input: { forward: number; strafe: number; sprint: boolean; rotation: number; animation: string; vehicle?: string }) {
  room?.send('input', input);
}

export function setServerVehicle(vehicle: string) { room?.send('vehicle', vehicle); }
export function getRoom() { return room; }
export function disconnectCity() { room?.leave(); room = null; }

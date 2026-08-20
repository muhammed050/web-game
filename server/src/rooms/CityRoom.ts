import { Room, Client } from 'colyseus';
import { CityState, PlayerState } from '../schema/PlayerState.js';

type Input = { forward?: number; strafe?: number; sprint?: boolean; rotation?: number; animation?: string; vehicle?: string };

export class CityRoom extends Room<CityState> {
  maxClients = 64;
  fixedTimeStep = 1000 / 30;

  onCreate() {
    this.setState(new CityState());
    this.onMessage('input', (client, input: Input) => this.applyInput(client, input));
    this.onMessage('vehicle', (client, vehicle: string) => {
      const player = this.state.players.get(client.sessionId);
      if (player) player.vehicle = vehicle === 'sedan' ? 'sedan' : '';
    });
    this.setSimulationInterval(() => this.tick(), this.fixedTimeStep);
  }

  onJoin(client: Client, options: { name?: string }) {
    const player = new PlayerState();
    player.name = sanitizeName(options?.name || 'Rider');
    player.x = 0; player.y = 0; player.z = 8;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) { this.state.players.delete(client.sessionId); }

  private applyInput(client: Client, input: Input) {
    const player = this.state.players.get(client.sessionId);
    if (!player || !input || typeof input !== 'object') return;
    const forward = clamp(Number(input.forward) || 0, -1, 1);
    const strafe = clamp(Number(input.strafe) || 0, -1, 1);
    const len = Math.hypot(forward, strafe) || 1;
    const speed = input.sprint ? 9 : 5;
    const dt = this.fixedTimeStep / 1000;
    player.x = clamp(player.x + strafe / len * speed * dt, -72, 72);
    player.z = clamp(player.z + forward / len * speed * dt, -65, 65);
    if (typeof input.rotation === 'number' && Number.isFinite(input.rotation)) player.rotation = input.rotation;
    player.animation = input.animation === 'run' ? 'run' : forward || strafe ? 'walk' : 'idle';
    if (typeof input.vehicle === 'string') player.vehicle = input.vehicle === 'sedan' ? 'sedan' : '';
  }

  private tick() {
    // Server simulation hook: future authoritative physics, NPCs, jobs and vehicle simulation live here.
    for (const player of this.state.players.values()) {
      player.x = clamp(player.x, -72, 72);
      player.z = clamp(player.z, -65, 65);
    }
  }
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function sanitizeName(v: string) { return v.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 18) || 'Rider'; }

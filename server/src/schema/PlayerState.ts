import { Schema, type, MapSchema } from '@colyseus/schema';

export class PlayerState extends Schema {
  @type('string') name = 'Rider';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') z = 8;
  @type('number') rotation = 0;
  @type('string') animation = 'idle';
  @type('string') vehicle = '';
  @type('number') health = 100;
}

export class CityState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

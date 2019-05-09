import {
  Tilemaps,
  Math
} from 'phaser';

export function intOrStrToInt(x: string | number) {
  return typeof x === 'number' ? x : parseInt(x, 10);
}

export function tileCenter(map: Tilemaps.Tilemap, pos: Math.Vector2) {
  pos.x += map.tileWidth / 2;
  pos.y += map.tileHeight / 2;
  return pos;
}

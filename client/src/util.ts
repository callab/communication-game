import {
  Tilemaps,
  Math
} from 'phaser';

export function intOrStrToInt(x: string | number) {
  return typeof x === 'number' ? x : parseInt(x, 10);
}

// Converts a position pointing to the top-left corner of a tile to position in
// the center of the tile
export function tileCenter(map: Tilemaps.Tilemap, pos: Math.Vector2) {
  pos.x += map.tileWidth / 2;
  pos.y += map.tileHeight / 2;
  return pos;
}

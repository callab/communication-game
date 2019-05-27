import { GameObjects, Tilemaps } from 'phaser';

const FLASHES_PER_SECOND = 3;

export class OreFlasher {
  lastFlashTime: number = 0;
  flashes: number = 0;
  map: Tilemaps.Tilemap;

  constructor(map) {
    this.map = map;
  }

  tryFlashOre(tilePos, time) {
    if (!this.map.hasTileAt(tilePos.x, tilePos.y, 'ore')) {
      return
    }

    if (time - this.lastFlashTime < 1000 / FLASHES_PER_SECOND) {
      return;
    }

    let tile = this.map.getTileAt(tilePos.x, tilePos.y, false, 'ore');
    tile.setAlpha(this.flashes % 2 == 0 ? 0.5 : 1);

    this.flashes += 1;
    this.lastFlashTime = time;
  }

  reset() {
    this.lastFlashTime = 0;
    this.flashes = 0;
  }
}

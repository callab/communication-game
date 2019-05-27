// Turns a Tiled map into a simpler JSON map that the server can use.
// Assumes that the 'data' for each layer is in CSV format.

const fs = require('fs');

let path = process.argv[0];
let str = fs.readFileSync(path);
let map = JSON.parse(str);

let oreLayer = map.layers.filter((layer) => {
  return layer.name === 'ore';
})[0];

let out = {
  width: oreLayer.width,
  height: oreLayer.height,
  tileWidth: 32,            // Assume this for now
  tileHeight: 32,
  data: oreLayer.data.map((tile) => tile > 0 ? 1 : 0)
};

console.log(JSON.stringify(out));

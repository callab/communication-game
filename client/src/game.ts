import * as Phaser from 'phaser';

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image('callab', 'images/callab.png');
  this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
  this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png');
  this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');
}

function create() {
  this.add.image(400, 300, 'sky');

  let particles = this.add.particles('red');

  let emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });

  let logo = this.physics.add.image(400, 100, 'callab');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}

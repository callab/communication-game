class Inventory {
  constructor() {
    this.ores = 0;
  }

  asJSON() {
    return {
      ores: this.ores
    };
  }
}

module.exports = Inventory;

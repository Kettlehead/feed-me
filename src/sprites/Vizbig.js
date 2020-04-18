import { createMachine, interpret } from "@xstate/fsm";

export default class Vizbig {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "mutant-plant");
    this.demandQueue = ["WATER", "BONES", "WATER", "SLUDGE"];
    this.health = 100;
    this.scene.time.addEvent({
      delay: 10000,
      loop: true,
      callback: this.popDemand,
      callbackScope: this,
      startAt: 9000,
    });
  }

  popDemand() {
    const demand = this.demandQueue.shift();
    console.warn(`FEED ME ${demand}!`);
    this.scene.events.emit("vizbig_demand", demand);
    this.addDemand();
  }

  addDemand() {
    this.demandQueue.push(
      Phaser.Utils.Array.GetRandom(["WATER", "BONES", "SLUDGE"])
    );
  }

  update(time, delta) {}

  destroy() {
    this.sprite.destroy();
  }
}

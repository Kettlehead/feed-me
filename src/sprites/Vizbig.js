import { DEMAND } from "./DemandType";

class Demand {
  constructor(type, time) {
    this.type = type;
    this.time = time;
  }
}

export default class Vizbig {
  constructor(scene, x, y) {
    this.scene = scene;
    this.seconds = 1000;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "mutant-plant");
    this.demandQueue = [
      new Demand(DEMAND.WATER, 20 * this.seconds),
      new Demand(DEMAND.BONES, 15 * this.seconds),
      new Demand(DEMAND.SLUDGE, 15 * this.seconds),
      new Demand(DEMAND.WATER, 13 * this.seconds),
    ];
    this.health = 100;
    this.dead = false;
    this.size = "small";
    this.getNextDemand();
    /**this.scene.time.addEvent({
      delay: 1000,
      repeat: 5,

      callback: () => {
        this.scene.events.emit("spawn_fruit");
      },
    });*/
  }

  getNextDemand() {
    this.currentDemand = this.demandQueue.shift();
    this.currentDemand.countdown = this.scene.time.addEvent({
      delay: this.currentDemand.time,
      callback: () => {
        this.failDemand();
      },
    });
    this.scene.events.emit("vizbig_demand", this.currentDemand);
    this.addDemand();
  }

  failDemand() {
    this.hurt(10);
    this.getNextDemand();
  }

  hurt(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.dead = true;
    }
    console.warn(`ARRRGH! (${this.health}%)`);
    this.scene.events.emit("vizbig_health", this.health);
    this.scene.cameras.main.shake(500, new Phaser.Math.Vector2(0, 0.008));
  }

  heal(amount) {
    this.health += amount;
    this.health = Math.min(this.health, 100);
    this.scene.events.emit("vizbig_health", this.health);
  }

  addDemand() {
    this.demandQueue.push(
      new Demand(
        Phaser.Utils.Array.GetRandom([
          DEMAND.WATER,
          DEMAND.BONES,
          DEMAND.SLUDGE,
        ]),
        11 * this.seconds
      )
    );
  }

  feedSludge() {
    console.warn("MMM! TASTY SLUDGE!");
    this.checkDemand(DEMAND.SLUDGE);
  }

  feedWater() {
    console.warn("MMM! TASTY WATER!");
    this.checkDemand(DEMAND.WATER);
  }

  feedBones() {
    console.warn("MMM! TASTY BONES!");
    this.checkDemand(DEMAND.BONES);
  }

  checkDemand(fed) {
    if (this.currentDemand.type === fed) {
      this.scene.events.emit("spawn_fruit");
      this.heal(5);
      this.currentDemand.countdown.remove();
      this.getNextDemand();
    }
  }

  update(time, delta) {}

  destroy() {
    this.currentDemand.countdown.remove();
    this.sprite.destroy();
  }
}

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
    this.seconds = 1400;
    this.defaultScale = 1.5;
    this.demandTime = 11;
    this.fruitAmount = 1;
    this.sprite = scene.physics.add
      .sprite(x + 10, y + 20, "atlas", "mutant-plant")
      .setOrigin(0.5, 1)
      .setScale(this.defaultScale, this.defaultScale)
      .setDepth(100);

    this.startAnimation();
    const startTime = 20;
    this.demandQueue = [
      new Demand(DEMAND.WATER, startTime * this.seconds),
      new Demand(DEMAND.BONES, (startTime - 5) * this.seconds),
      new Demand(DEMAND.SLUDGE, (startTime - 5) * this.seconds),
      new Demand(DEMAND.WATER, (startTime - 7) * this.seconds),
    ];
    this.health = 100;
    this.dead = false;
    this.size = "small";
    this.food = 0;
    this.getNextDemand();
    /**this.scene.time.addEvent({
      delay: 1000,
      repeat: 5,

      callback: () => {
        this.scene.events.emit("spawn_fruit");
      },
    });*/
  }

  startAnimation() {
    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      scaleX: this.defaultScale * 0.75,
      scaleY: this.defaultScale * 1.5,
      duration: 1500,
      yoyo: true,
      repeat: 999999,
    });
  }

  clearAnimations() {
    this.scene.tweens.remove(this.tween);
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
        this.demandTime * this.seconds
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
      this.scene.events.emit("spawn_fruit", Math.floor(this.fruitAmount));
      this.heal(5);
      this.increase();
      this.currentDemand.countdown.remove();
      this.getNextDemand();
    }
  }

  increase() {
    this.food += 1;
    console.log(`Food: ${this.food}`);
    if (this.food >= 5) {
      this.defaultScale *= 1.5;
      this.fruitAmount += 0.5;
      this.clearAnimations();
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: this.defaultScale,
        scaleY: this.defaultScale,
        duration: 1000,
        onComplete: () => {
          this.startAnimation();
        },
      });
      this.demandTime -= 3;
      this.food = 0;
    }
  }

  destroy() {
    this.clearAnimations();
    this.currentDemand.countdown.remove();
    this.sprite.destroy();
  }
}

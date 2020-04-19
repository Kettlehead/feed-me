export default class Tank {
  constructor(scene, x, y) {
    this.scene = scene;
    this.beingCarried = false;
    this.full = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "empty-tank");
    this.sprite.body.setCollideWorldBounds();
    this.scene.events.on("fill_tank", () => {
      this.fill();
    });
    this.scene.events.on("empty_tank", () => {
      this.empty();
    });
  }

  fill() {
    console.log("Filling tank...");
    this.full = true;
    this.sprite.setTexture("atlas", "full-tank");
  }

  empty() {
    console.log("Emptying tank...");
    this.full = false;
    this.sprite.setTexture("atlas", "empty-tank");
  }

  pickup() {
    this.beingCarried = true;
    this.sprite.setPosition(
      this.scene.player.sprite.x + 10,
      this.scene.player.sprite.y + 5
    );
    this.scene.events.once("drop", () => {
      this.beingCarried = false;
      this.sprite.body.setVelocity(0);
      this.sprite.setPosition(
        this.scene.player.sprite.x + 10,
        this.scene.player.sprite.y + 20
      );
    });
  }

  update() {
    if (this.beingCarried) {
      this.sprite.body.setVelocity(
        this.scene.player.sprite.body.velocity.x,
        this.scene.player.sprite.body.velocity.y
      );
    }
  }

  destroy() {
    this.scene.events.removeAllListeners("fill_tank");
    this.scene.events.removeAllListeners("empty_tank");
    this.scene.events.removeAllListeners("drop");
    this.sprite.destroy();
  }
}

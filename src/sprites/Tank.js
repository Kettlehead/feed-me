export default class Bones {
  constructor(scene, x, y) {
    this.scene = scene;
    this.beingCarried = false;
    this.full = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "empty-tank");
    this.sprite.body.setCollideWorldBounds();
  }

  fill() {
    this.full = true;
    this.sprite.setTexture("atlas", "full-tank");
  }

  empty() {
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
      if (!this.scene.player.colliding) {
        this.sprite.body.setVelocity(
          this.scene.player.sprite.body.velocity.x,
          this.scene.player.sprite.body.velocity.y
        );
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}

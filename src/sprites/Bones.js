export default class Bones {
  constructor(scene, x, y) {
    this.scene = scene;
    this.beingCarried = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "bones");

    this.sprite.body.setCollideWorldBounds();
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
    this.sprite.destroy();
  }
}

export default class Bones {
  constructor(scene, x, y) {
    this.scene = scene;
    this.beingCarried = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "bones");
    this.scene.bonesGroup.add(this.sprite);
    this.sprite.body.setCollideWorldBounds();
    this.sprite.data = this;
    this.alive = true;
  }

  pickup() {
    this.beingCarried = true;
    this.sprite.setPosition(
      this.scene.player.sprite.x + 10,
      this.scene.player.sprite.y + 5
    );
    this.scene.events.once("drop", () => {
      if (!this.destroyed && this.alive) {
        this.beingCarried = false;
        this.sprite.body.setVelocity(0);
      }
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
    if (this.alive) {
      console.log("destroy bones!");
      this.alive = false;
      //this.sprite.destroy();
    }
  }
}

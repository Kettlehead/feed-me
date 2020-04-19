export default class Fruit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "atlas", "fruit");
    //this.scene.physics.world.enable(this);
    this.scene.fruitGroup.add(this);
    this.alive = true;
    let xVelocity = Phaser.Math.Between(0, 120);
    let yVelocity = Phaser.Math.Between(80, 120);
    if (Math.random() > 0.5) {
      xVelocity *= -1;
    }
    if (Math.random() > 0.5) {
      yVelocity *= -1;
    }
    this.body.setVelocity(xVelocity, yVelocity);
    this.body.allowDrag = true;
    this.body.setDrag(30, 30);
    this.beingCarried = false;
  }

  pickup() {
    this.beingCarried = true;
    this.setPosition(
      this.scene.player.sprite.x + 10,
      this.scene.player.sprite.y + 5
    );
    this.scene.events.once("drop", () => {
      this.drop();
    });
  }
  drop() {
    this.beingCarried = false;
    if (this.alive) {
      this.body.setVelocity(0);
    }
  }

  update(time, delta) {
    super.update(time, delta);
    if (this.beingCarried) {
      this.body.setVelocity(
        this.scene.player.sprite.body.velocity.x,
        this.scene.player.sprite.body.velocity.y
      );
    }
  }
}

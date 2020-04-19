import { createMachine, interpret } from "@xstate/fsm";

export default class Bucket {
  constructor(scene, x, y, player) {
    this.scene = scene;
    this.alive = true;
    this.player = player;
    this.beingCarried = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "empty-bucket");
    this.scene.events.on("fill_bucket", () => {
      this.service.send("FILL");
    });
    this.scene.events.on("empty_bucket", () => {
      this.service.send("EMPTY");
    });
    this.scene.events.on("pickup", (item) => {
      if (item === "BUCKET") {
        this.beingCarried = true;
        if (this.alive) {
          this.sprite.setPosition(
            this.player.sprite.x + 10,
            this.player.sprite.y + 5
          );
        }
        this.scene.events.once("drop", () => {
          this.beingCarried = false;
          if (this.alive) {
            this.sprite.body.setVelocity(0);
            this.sprite.setPosition(
              this.scene.player.sprite.x + 10,
              this.scene.player.sprite.y + 20
            );
          }
        });
      }
    });
    this.sprite.body.setCollideWorldBounds();
    this.contents = createMachine({
      id: "contents",
      initial: "empty",
      states: {
        empty: {
          on: {
            FILL: {
              target: "full",
            },
          },
        },
        full: {
          on: {
            EMPTY: {
              target: "empty",
            },
          },
        },
      },
    });
    this.service = interpret(this.contents).start();
    this.service.subscribe((state) => {
      if (state.changed) {
        if (state.value == "empty") {
          this.sprite.setTexture("atlas", "empty-bucket");
        } else {
          this.sprite.setTexture("atlas", "full-bucket");
        }
      }
    });
  }

  update() {
    if (this.beingCarried && this.alive) {
      this.sprite.body.setVelocity(
        this.player.sprite.body.velocity.x,
        this.player.sprite.body.velocity.y
      );
    }
  }

  destroy() {
    this.alive = false;
    this.scene.events.removeAllListeners("fill_bucket");
    this.scene.events.removeAllListeners("empty_bucket");
    this.scene.events.removeAllListeners("pickup");
    this.sprite.destroy();
    this.service.stop();
  }
}

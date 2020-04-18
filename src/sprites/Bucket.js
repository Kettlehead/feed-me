import { createMachine, interpret } from "@xstate/fsm";

export default class Bucket {
  constructor(scene, x, y, player) {
    this.scene = scene;
    this.player = player;
    this.beingCarried = false;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "empty-bucket");
    this.scene.events.on("pickup", (item) => {
      if (item === "BUCKET") {
        this.beingCarried = true;
        this.scene.events.once("drop", () => {
          this.beingCarried = false;
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
    if (this.beingCarried) {
      this.sprite.setPosition(
        this.player.sprite.x + 10,
        this.player.sprite.y + 5
      );
    }
  }

  destroy() {
    this.sprite.destroy();
    this.service.stop();
  }
}

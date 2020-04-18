import { createMachine, interpret } from "@xstate/fsm";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "atlas", "player");
    this.scene.events.on("pickup", (item) => {
      this.carryService.send(item);
    });
    this.sprite.body.setCollideWorldBounds();
    this.shouldDropOrPickup = false;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.cursors.space.on("down", () => {
      this.shouldDropOrPickup = true;
    });
    this.carryingMachine = createMachine({
      id: "carrying",
      initial: "not_carrying",
      states: {
        not_carrying: {
          on: {
            BUCKET: {
              target: "carrying_bucket",
              actions: () => {
                console.log("Pickup bucket");
              },
            },
            TANK: {
              target: "carrying_tank",
              actions: () => {
                console.log("Pickup tank");
              },
            },
            BONES: {
              target: "carrying_bones",
              actions: () => {
                console.log("Pickup bones");
              },
            },
            FRUIT: "carrying_fruit",
          },
        },
        carrying_bucket: {
          on: {
            DROP: {
              target: "not_carrying",
              actions: () => {
                console.log("Drop bucket thanks.");
                this.scene.events.emit("drop");
              },
            },
          },
        },
        carrying_tank: {
          on: {
            DROP: {
              target: "not_carrying",
              actions: () => {
                console.log("Drop tank thanks.");
                this.scene.events.emit("drop");
              },
            },
          },
        },
        carrying_bones: {
          on: {
            DROP: {
              target: "not_carrying",
              actions: () => {
                console.log("Drop bones thanks.");
                this.scene.events.emit("drop");
              },
            },
          },
        },
        carrying_fruit: {
          on: {
            DROP: { target: "not_carrying" },
          },
        },
      },
    });
    this.carryService = interpret(this.carryingMachine).start();
    this.carryService.subscribe((state) => {
      if (state.changed) {
        console.log(state);
      }
    });
  }

  update(time, delta) {
    const speed = 300;
    //const prevVelocity = player.body.velocity.clone();

    this.sprite.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.sprite.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.sprite.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.sprite.body.setVelocityY(speed);
    }

    if (this.shouldDropOrPickup) {
      console.log(`current state: ${this.carryService.state.value}`);
      this.shouldDropOrPickup = false;
      if (this.carryService.state.value === "not_carrying") {
        this.scene.events.emit("attempt_pickup", this);
      } else {
        this.carryService.send("DROP");
      }
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.sprite.body.velocity.normalize().scale(speed);
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  destroy() {
    this.sprite.destroy();
    this.carryService.stop();
  }
}

import Phaser from "phaser";
import { SCENE } from "./index";
import Player from "../sprites/Player";
import Bucket from "../sprites/Bucket";
import Bones from "../sprites/Bones";
import Tank from "../sprites/Tank";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x263d0a);
    this.map = this.make.tilemap({ key: "world" });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.tileset = this.map.addTilesetImage("Tiles");
    this.layer = this.map.createStaticLayer("Ground", this.tileset, 0, 0);

    this.player = new Player(this, 200, 300);
    this.bucket = new Bucket(this, 100, 100, this.player);
    this.bones = new Bones(this, 100, 200);
    this.tank = new Tank(this, 100, 300);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.events.on("attempt_pickup", () => {
      console.log("Game: attempting to pickup...");
      if (this.physics.collide(this.player.sprite, this.bucket.sprite)) {
        this.events.emit("pickup", "BUCKET");
      } else if (this.physics.collide(this.player.sprite, this.bones.sprite)) {
        this.bones.pickup();
        this.events.emit("pickup", "BONES");
      } else if (this.physics.collide(this.player.sprite, this.tank.sprite)) {
        this.tank.pickup();
        this.events.emit("pickup", "TANK");
      }
      {
        /**this.events.emit(
          "pickup",
          Phaser.Utils.Array.GetRandom(["BONES", "TANK", "FRUIT"])
        );**/
      }
    });
  }

  update(time, delta) {
    this.player.update();
    this.bucket.update();
    this.bones.update();
    this.tank.update();
  }
}

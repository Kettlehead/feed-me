import Phaser from "phaser";
import { SCENE } from "./index";
import Player from "../sprites/Player";
import Bucket from "../sprites/Bucket";
import Bones from "../sprites/Bones";
import Tank from "../sprites/Tank";
import Vizbig from "../sprites/Vizbig";

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
    this.rootsLayer = this.map.createStaticLayer("Roots", this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collides: true });

    const spawnPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    const bucketPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Bucket"
    );
    this.bucket = new Bucket(this, bucketPoint.x, bucketPoint.y, this.player);

    this.bonesGroup = this.physics.add.group();
    this.layer.forEachTile((tile) => {
      if (tile.index === 15) {
        new Bones(this, tile.getCenterX(), tile.getCenterY());
      }
    });
    const tankPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Tank"
    );
    this.tank = new Tank(this, tankPoint.x, tankPoint.y);

    this.physics.add.collider(this.player.sprite, this.layer);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    const vizbigSpawn = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Vizbig"
    );
    this.vizbig = new Vizbig(this, vizbigSpawn.x, vizbigSpawn.y);

    this.events.on("attempt_pickup", () => {
      console.log("Game: Checking pickup collisions...");
      if (this.physics.collide(this.player.sprite, this.bucket.sprite)) {
        this.events.emit("pickup", "BUCKET");
      } else if (this.physics.collide(this.player.sprite, this.bonesGroup)) {
        this.physics.collide(
          this.player.sprite,
          this.bonesGroup,
          (player, bones) => {
            bones.data.pickup();
            this.events.emit("pickup", "BONES");
          }
        );
      } else if (this.physics.collide(this.player.sprite, this.tank.sprite)) {
        this.tank.pickup();
        this.events.emit("pickup", "TANK");
      }
    });

    this.events.on("carry_action", (state) => {
      switch (state) {
        case "carrying_bucket":
          this.checkBucketAction();
          break;
        default:
          this.events.emit("drop");
          break;
      }
    });
  }

  checkBucketAction() {
    const currentTile = this.layer.getTileAtWorldXY(
      this.player.sprite.x,
      this.player.sprite.y
    );
    if (currentTile.properties.wet) {
      this.events.emit("fill_bucket");
    } else {
      this.events.emit("drop");
    }
  }

  update(time, delta) {
    this.player.update();
    this.bucket.update();
    this.bonesGroup.getChildren().forEach((bones) => {
      bones.data.update();
    });
    this.tank.update();

    if (this.vizbig.dead || this.player.dead) {
      this.scene.start(SCENE.GAME_OVER);
    }
  }
}

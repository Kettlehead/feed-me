import Phaser from "phaser";
import { SCENE } from "./index";
import Player from "../sprites/Player";
import Bucket from "../sprites/Bucket";
import Bones from "../sprites/Bones";
import Tank from "../sprites/Tank";
import Vizbig from "../sprites/Vizbig";
import Fruit from "../sprites/Fruit";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x263d0a);
    this.music = this.sound.add("backgroundMusic");
    this.music.setVolume(0.3);
    this.music.setLoop(true);
    this.gameOver = false;
    const gameLimit = 4 * 60 * 1000;
    this.gameTimer = this.time.addEvent({
      delay: gameLimit,
      callback: () => {
        this.gameOver = true;
      },
    });
    const HUD = this.scene.get(SCENE.HUD);
    HUD.setGameTimer(this.gameTimer);
    //this.music.play();
    this.map = this.make.tilemap({ key: "world" });
    const vizbigSpawn = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Vizbig"
    );
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.tileset = this.map.addTilesetImage("Tiles");
    this.layer = this.map.createStaticLayer("Ground", this.tileset, 0, 0);
    this.add.image(vizbigSpawn.x, vizbigSpawn.y, "atlas", "roots");
    //this.rootsLayer = this.map.createStaticLayer("Roots", this.tileset, 0, 0);
    //this.layer.setCollisionByProperty({ collides: true });
    this.score = 0;
    this.dropDistance = 140;

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

    this.fruitGroup = this.physics.add.group();
    this.fruitGroup.runChildUpdate = true;

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

    //this.physics.add.collider(this.player.sprite, this.layer);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.vizbig = new Vizbig(this, vizbigSpawn.x, vizbigSpawn.y);

    this.events.on("attempt_pickup", () => {
      console.log("Game: Checking pickup collisions...");
      let pickedUp = false;
      this.physics.collide(
        this.player.sprite,
        this.fruitGroup,
        (player, fruit) => {
          fruit.pickup();
          this.events.emit("pickup", "FRUIT");
          pickedUp = true;
        }
      );
      if (pickedUp) return;
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
        case "carrying_tank":
          this.checkTankAction();
          break;
        case "carrying_bones":
          this.checkBonesAction();
          break;
        case "carrying_fruit":
          this.checkFruitAction();
          break;
        default:
          this.events.emit("drop");
          break;
      }
    });

    this.events.on("spawn_fruit", this.spawnFruit, this);

    this.dropSound = this.sound.add("dropSFX");
    this.events.on("drop", () => {
      this.dropSound.play();
    });
    this.pickupSound = this.sound.add("pickupSFX");
    this.events.on("pickup", () => {
      this.pickupSound.play();
    });
    this.scoreSound = this.sound.add("scoreSFX");
    this.events.on("score_fruit", () => {
      this.scoreSound.play();
    });
    this.splashSound = this.sound.add("splashSFX");
    this.goopSound = this.sound.add("goopSFX");
  }

  spawnFruit(amount) {
    for (let i = 0; i < amount; i++) {
      const fruit = new Fruit(this, this.vizbig.sprite.x, this.vizbig.sprite.y);
      this.add.existing(fruit);
    }
  }

  checkBucketAction() {
    const currentTile = this.layer.getTileAtWorldXY(
      this.player.sprite.x,
      this.player.sprite.y
    );
    if (
      this.bucket.service.state.value == "full" &&
      Phaser.Math.Distance.Between(
        this.bucket.sprite.x,
        this.bucket.sprite.y,
        this.vizbig.sprite.x,
        this.vizbig.sprite.y
      ) < this.dropDistance
    ) {
      this.events.emit("empty_bucket");
      //this.events.emit("drop");
      this.vizbig.feedWater();
    } else if (currentTile.properties.wet) {
      this.events.emit("fill_bucket");
      this.splashSound.play();
    } else {
      this.events.emit("drop");
    }
  }

  checkTankAction() {
    const currentTile = this.layer.getTileAtWorldXY(
      this.player.sprite.x,
      this.player.sprite.y
    );
    if (
      this.tank.full &&
      Phaser.Math.Distance.Between(
        this.tank.sprite.x,
        this.tank.sprite.y,
        this.vizbig.sprite.x,
        this.vizbig.sprite.y
      ) < this.dropDistance
    ) {
      this.events.emit("empty_tank");
      //this.events.emit("drop");
      this.vizbig.feedSludge();
    } else if (currentTile.properties.toxic) {
      this.events.emit("fill_tank");
      this.goopSound.play();
    } else {
      this.events.emit("drop");
    }
  }

  checkBonesAction() {
    if (
      Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.vizbig.sprite.x,
        this.vizbig.sprite.y
      ) < this.dropDistance
    ) {
      let oldBones;
      this.bonesGroup.getChildren().forEach((bones) => {
        if (bones.data.beingCarried) {
          oldBones = bones;
        }
      });
      if (oldBones) {
        this.bonesGroup.remove(oldBones);
        oldBones.destroy();
      }

      this.vizbig.feedBones();
    }
    this.events.emit("drop");
  }

  checkFruitAction() {
    const home = this.map.findObject("Objects", (obj) => obj.name === "Home");
    if (
      Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        home.x,
        home.y
      ) < 50
    ) {
      let carriedFruit;
      this.fruitGroup.getChildren().forEach((fruit) => {
        if (fruit.beingCarried) {
          carriedFruit = fruit;
        }
      });
      if (carriedFruit) {
        carriedFruit.alive = false;
        this.fruitGroup.remove(carriedFruit, false, true);
      }
      this.score++;
      this.events.emit("score_fruit", this.score);
    }
    this.events.emit("drop");
  }

  update(time, delta) {
    this.player.update();
    this.bucket.update();
    this.bonesGroup.getChildren().forEach((bones) => {
      bones.data.update();
    });
    this.tank.update();

    if (this.vizbig.dead || this.player.dead || this.gameOver) {
      const HUD = this.scene.get(SCENE.HUD);
      HUD.scene.stop();
      this.cleanUp();
      this.scene.start(SCENE.GAME_OVER, {
        vizbigDead: this.vizbig.dead,
        playerWon: this.gameOver,
        score: this.score,
      });
    }
  }

  cleanUp() {
    this.music.stop();
    this.events.removeAllListeners("pickup");
    this.events.removeAllListeners("drop");
    this.events.removeAllListeners("spawn_fruit");
    this.events.removeAllListeners("score_fruit");
    this.events.removeAllListeners("carry_action");
    this.events.removeAllListeners("attempt_pickup");
    this.bucket.destroy();
    this.tank.destroy();
    this.player.destroy();
    this.gameTimer.remove();
  }
}

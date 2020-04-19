import Phaser from "phaser";
import { SCENE } from "./index";

export default class HUD extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.HUD });
  }

  init() {
    this.input.keyboard.enabled = false;
  }

  create() {
    this.scene.bringToTop();

    const boxWidth = 800;
    const boxHeight = 78;
    const background = this.add.graphics().setScrollFactor(0);
    background.fillStyle(0x222222, 0.8);
    background.fillRect(
      this.cameras.main.centerX - boxWidth / 2,
      0,
      boxWidth,
      boxHeight
    );
    this.vizbigHealth = this.add
      .bitmapText(24, 12, "alagard", `VIZBIG HEALTH`)
      .setScrollFactor(0);

    this.vizbigBox = this.add.graphics().setScrollFactor(0);
    this.vizbigBox.fillStyle(0x222222, 1);
    this.vizbigBox.fillRect(20, 36, 200, 16);
    this.vizbigBar = this.add.graphics().setScrollFactor(0);
    this.vizbigBar.fillStyle(0x9fe745, 1);
    this.vizbigBar.fillRect(24, 40, 190, 8);

    const demandW = 300;
    const whiteBox = this.add.graphics();
    whiteBox.fillStyle(0xffffff, 0.5);
    whiteBox.fillRect(
      this.cameras.main.centerX - demandW / 2,
      0,
      demandW,
      boxHeight
    );
    this.demandTextShadow = this.add
      .bitmapText(272, 6, "alagard", `VIZBIG DEMANDS:\nNOTHING!`, 32)
      .setScrollFactor(0);
    this.demandTextShadow.tint = 0x000000;
    this.demandText = this.add
      .bitmapText(270, 4, "alagard", `VIZBIG DEMANDS:\nNOTHING!`, 32)
      .setScrollFactor(0);
    this.demandBox = this.add.graphics().setScrollFactor(0);
    this.demandBox.fillStyle(0x333333, 1);
    this.demandBox.fillRect(410, 45, 120, 22);
    this.demandTimer = this.add.graphics().setScrollFactor(0);

    this.scoreText = this.add
      .bitmapText(570, 12, "alagard", "SCORE: 0")
      .setScrollFactor(0);

    this.gameLeftText = this.add
      .bitmapText(570, 42, "alagard", "TIME TO END:")
      .setScrollFactor(0);

    this.timeLeftBox = this.add.graphics().setScrollFactor(0);
    this.timeLeftBox.fillStyle(0x000000, 1);
    this.timeLeftBox.fillRect(680, 47, 100, 10);
    this.timeLeftBar = this.add.graphics().setScrollFactor(0);

    const gameScene = this.scene.get(SCENE.GAME);
    gameScene.events.on("vizbig_demand", this.updateDemand, this);
    gameScene.events.on("vizbig_queue", this.updateQueue, this);
    gameScene.events.on("vizbig_health", this.updateVizbigHealth, this);
    gameScene.events.on("player_health", this.updatePlayerHealth, this);
    gameScene.events.on("score_fruit", this.updateScore, this);
  }

  updateScore(score) {
    this.scoreText.text = `SCORE: ${score}`;
  }

  updateDemand(demand) {
    this.currentDemand = demand;
    this.demandText.text = `VIZBIG DEMANDS:\n${this.currentDemand.type}!`;
    this.demandTextShadow.text = `VIZBIG DEMANDS:\n${this.currentDemand.type}!`;
  }

  updateQueue(queue) {}

  updateVizbigHealth(health) {
    //this.vizbigHealth.text = `VIZBIG HEALTH: ${health}%`;
    this.vizbigBar.clear();
    this.vizbigBar.fillStyle(0x9fe745, 1);
    this.vizbigBar.fillRect(24, 40, 190 * (health / 100), 8);
  }

  updatePlayerHealth(health) {
    //this.playerHealth.text = `SURVIVOR HEALTH: ${health}%`;
  }

  setGameTimer(timer) {
    this.gameTimer = timer;
  }

  update(time, delta) {
    //console.log(this.currentDemand);
    if (this.currentDemand && this.currentDemand.countdown) {
      //console.log(this.demandTimer.scaleX);
      this.demandTimer.clear();
      this.demandTimer.fillStyle(0xffffff, 1);
      this.demandTimer.fillRect(
        410,
        45,
        120 * (1 - this.currentDemand.countdown.getProgress()),
        22
      );
    }
    if (this.gameTimer) {
      this.timeLeftBar.clear();
      this.timeLeftBar.fillStyle(0xffffff, 1);
      this.timeLeftBar.fillRect(
        680,
        47,
        100 * (1 - this.gameTimer.getProgress()),
        10
      );
    }
  }
}

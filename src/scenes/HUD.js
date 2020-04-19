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
    const boxHeight = 48;
    const feedMe = this.add.graphics().setScrollFactor(0);
    feedMe.fillStyle(0x222222, 0.8);
    feedMe.fillRect(
      this.cameras.main.centerX - boxWidth / 2,
      0,
      boxWidth,
      boxHeight
    );
    this.vizbigHealth = this.add
      .bitmapText(20, 14, "alagard", `VIZBIG HEALTH: ${100}%`)
      .setScrollFactor(0);

    this.playerHealth = this.add
      .bitmapText(200, 14, "alagard", `SURVIVOR HEALTH: ${100}%`)
      .setScrollFactor(0);

    this.scoreText = this.add
      .bitmapText(450, 14, "alagard", "SCORE: 0")
      .setScrollFactor(0);
    this.demandText = this.add
      .bitmapText(580, 14, "alagard", `VIZBIG DEMANDS: NOTHING!`)
      .setScrollFactor(0);
    this.demandTimer = this.add.graphics().setScrollFactor(0);
    this.demandTimer.fillStyle(0xffffff, 1);
    this.demandTimer.fillRect(580, 20, 100, 4);
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
    this.demandText.text = `VIZBIG DEMANDS: ${this.currentDemand.type}!`;
  }

  updateQueue(queue) {}

  updateVizbigHealth(health) {
    this.vizbigHealth.text = `VIZBIG HEALTH: ${health}%`;
  }

  updatePlayerHealth(health) {
    this.playerHealth.text = `SURVIVOR HEALTH: ${health}%`;
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
        580,
        38,
        200 * (1 - this.currentDemand.countdown.getProgress()),
        4
      );
    }
    if (this.gameTimer) {
      //update timer bar!
    }
  }
}

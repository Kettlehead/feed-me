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
    const vizbigHealth = 99;
    this.add
      .bitmapText(20, 14, "alagard", `VIZBIG HEALTH: ${vizbigHealth}%`)
      .setScrollFactor(0);

    const playerHealth = 82;
    this.add
      .bitmapText(200, 14, "alagard", `SURVIVOR HEALTH: ${playerHealth}%`)
      .setScrollFactor(0);

    this.currentDemand = "NOTHING";
    this.demandText = this.add
      .bitmapText(580, 14, "alagard", `VIZBIG DEMANDS: ${this.currentDemand}!`)
      .setScrollFactor(0);

    const gameScene = this.scene.get(SCENE.GAME);
    gameScene.events.on("vizbig_demand", this.updateDemand, this);
    gameScene.events.on("vizbig_health_update", this.updateVizbigHealth, this);
    gameScene.events.on("player_health_update", this.updatePlayerHealth, this);
  }

  updateDemand(demand) {
    this.currentDemand = demand;
    this.demandText.text = `VIZBIG DEMANDS: ${this.currentDemand}!`;
  }

  updateVizbigHealth(health) {
    //this.demandText.text = `VIZBIG HEALTH: ${health}%`;
  }

  updatePlayerHealth(health) {
    //this.demandText.text = `SURVIVOR HEALTH: ${health}%`;
  }
}

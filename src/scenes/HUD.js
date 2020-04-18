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

    this.add
      .bitmapText(580, 14, "alagard", `VIZBIG DEMANDS: ${"WATER"}!`)
      .setScrollFactor(0);
  }
}

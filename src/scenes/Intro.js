import Phaser from "phaser";
import { SCENE } from "./index";

export default class Intro extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.INTRO });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x263d0a);
    const introText = this.add.bitmapText(
      0,
      0,
      "alagard",
      "Another day dawns in the wasteland..."
    );
    Phaser.Display.Align.In.Center(
      introText,
      this.add.zone(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height
      )
    );
    this.input.keyboard.on("keydown", () => {
      this.scene.launch(SCENE.HUD);
      this.scene.start(SCENE.GAME);
    });
  }
}

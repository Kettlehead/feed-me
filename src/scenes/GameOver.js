import Phaser from "phaser";
import { SCENE } from "./index";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME_OVER });
  }

  create() {
    const finalText = this.add.bitmapText(
      20,
      14,
      "alagard",
      `A terrible shame that you have died. Press any key to restart`
    );
    Phaser.Display.Align.In.Center(
      finalText,
      this.add.zone(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height
      )
    );
    this.input.keyboard.on("keydown", () => {
      const cam = this.cameras.main;
      cam.fade(500, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.scene.start(SCENE.INTRO);
      });
    });
  }
}

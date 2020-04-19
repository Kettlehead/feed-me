import Phaser from "phaser";
import { SCENE } from "./index";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME_OVER });
  }

  create(data) {
    let message = `A terrible shame that you have died.\n\nPress any key to restart.`;
    if (true || data.vizbigDead) {
      message = `A terrible shame that Vizbig died.\n\nYou have no way of surviving the wasteland now.\n\nPress any key to restart.`;
    }
    const finalText = this.add.bitmapText(20, 14, "alagard", message);
    Phaser.Display.Align.In.Center(
      finalText,
      this.add.zone(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height
      )
    );
    /**const restartMessage = this.add.bitmapText(
      0,
      0,
      "alagard",
      "Press any key to restart"
    );
    Phaser.Display.Align.In.Center(
      restartMessage,
      this.add.zone(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height
      )
    );
    restartMessage.y += 40;*/

    this.input.keyboard.on("keydown", () => {
      const cam = this.cameras.main;
      cam.fade(500, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.scene.launch(SCENE.HUD);
        this.scene.start(SCENE.GAME);
      });
    });
  }
}

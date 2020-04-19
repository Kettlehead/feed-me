import Phaser from "phaser";
import { SCENE } from "./index";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME_OVER });
  }

  create(data) {
    let message = `A terrible shame that you have died.\n\nPress any key to restart.\n\nYou scored: ${data.score}.`;
    if (data.vizbigDead) {
      message = `A terrible shame that Vizbig died.\n\nYou have no way of surviving the wasteland now.\n\nYou scored: ${data.score}.`;
    } else {
      message = `Well done for surviving another day.\n\nVizbig shrinks down once more...\n\nYou'll get to do this all again tomorrow\n\nYou scored: ${data.score}.`;
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
    const restartMessage = this.add.bitmapText(
      finalText.x,
      0,
      "alagard",
      "Press R to restart"
    );
    restartMessage.y = finalText.y + finalText.height + 20;
    restartMessage.alpha = 0;

    this.tweens.add({
      targets: restartMessage,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.setupRestart();
      },
    });
  }

  setupRestart() {
    this.input.keyboard.once("keydown-R", () => {
      const cam = this.cameras.main;
      cam.fade(500, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.scene.launch(SCENE.HUD);
        this.scene.start(SCENE.GAME);
      });
    });
  }
}

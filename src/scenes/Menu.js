import Phaser from "phaser";
import { SCENE } from "./index";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.MENU });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x263d0a);
    /**this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      "atlas",
      "menu-title"
    );*/
    const menuText = this.add.bitmapText(
      this.cameras.main.centerX,
      100,
      "feedMe",
      "Feed Me!",
      128
    );
    menuText.x -= menuText.width / 2;
    const startText = this.add.bitmapText(
      0,
      0,
      "alagard",
      "Press any key to start",
      32
    );
    Phaser.Display.Align.In.Center(
      startText,
      this.add.zone(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height
      )
    );
    startText.y += 90;
    this.input.keyboard.on("keydown", () => {
      const cam = this.cameras.main;
      cam.fade(500, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.scene.start(SCENE.INTRO);
      });
    });
  }
}

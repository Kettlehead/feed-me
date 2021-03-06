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
      90,
      "alagard",
      "Another day dawns in the wasteland..."
    );
    introText.x = this.cameras.main.centerX - introText.width / 2;

    this.addText(130, "You must feed the mutant plant Vizbig what it demands!");
    this.addText(
      150,
      "When fed, it will bear fruit. Carry fruit home to score."
    );
    this.addText(
      170,
      "Drop water, sludge and bones onto Vizbig's roots to feed it."
    );
    this.addText(210, "Water is to the West");
    this.addText(230, "Toxic Sludge is to the South");
    this.addText(250, "Bones are to the East");

    this.addText(290, "Use the bucket to collect water");
    const background = this.add.graphics();
    background.fillStyle(0xeeeeee, 0.8);
    background.fillRect(580 - 40, 280, 30, 30);
    this.add.image(594 - 40, 296, "atlas", "empty-bucket");
    this.addText(346, "Use the tank to collect sludge");
    const sludge = this.add.graphics();
    sludge.fillStyle(0xeeeeee, 0.8);
    sludge.fillRect(580 - 40, 280 + 60, 30, 30);
    this.add.image(594 - 40, 296 + 60, "atlas", "empty-tank");
    this.addText(316, "Bones and fruit can be picked up by hand");

    this.addText(380, "Arrow keys control your movement");
    const endText = this.addText(
      400,
      "Space to pick up / drop / deliver / empty"
    );

    const startMessage = this.addText(
      endText.y + endText.height + 20,
      "Press any key to start"
    );
    startMessage.alpha = 0;

    this.tweens.add({
      targets: startMessage,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.setupKeys();
      },
    });
  }

  addText(y, text) {
    const bitmapText = this.add.bitmapText(0, y, "alagard", text);
    bitmapText.x = this.cameras.main.centerX - bitmapText.width / 2;
    return bitmapText;
  }

  setupKeys() {
    this.input.keyboard.on("keydown", () => {
      this.scene.launch(SCENE.HUD);
      this.scene.start(SCENE.GAME);
    });
  }
}

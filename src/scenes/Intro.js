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
    this.addText(170, "You must keep Vizbig alive by feeding it.");
    this.addText(210, "Water is to the West");
    this.addText(230, "Toxic Sludge is to the South");
    this.addText(250, "Bones are to the East");

    this.addText(290, "Use the bucket to collect water");
    this.addText(310, "Use the tank to collect sludge");
    this.addText(330, "Bones and fruit can be picked up by hand");

    this.addText(370, "Arrow keys control your movement");
    const endText = this.addText(
      390,
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
      duration: 500,
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

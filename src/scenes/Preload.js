import Phaser from "phaser";
import { SCENE } from "./index";

const boxWidth = 320;
const boxHeight = 50;
const boxPadding = 10;
const progressWidth = boxWidth - 2 * boxPadding;
const progressHeight = boxHeight - 2 * boxPadding;

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.PRELOAD });
  }

  preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      this.cameras.main.centerX - boxWidth / 2,
      this.cameras.main.centerY - boxHeight / 2,
      boxWidth,
      boxHeight
    );

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        this.cameras.main.centerX - progressWidth / 2,
        this.cameras.main.centerY - progressHeight / 2,
        progressWidth * value,
        progressHeight
      );
    });

    this.fileErrors = [];
    this.load.on("loaderror", (file) => {
      this.fileErrors.push({ key: file.key, src: file.src });
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      console.log("Loading complete.");
      if (this.fileErrors.length > 0) {
        console.error(
          `${this.fileErrors.length} files failed to load. Please reload the page.`
        );
      }
    });

    this.load.pack({ key: "preload", url: "assets/pack.json" });
  }

  create() {
    if (this.fileErrors.length === 0) {
      Phaser.GameObjects.BitmapText.ParseFromAtlas(
        this,
        "alagard",
        "atlas",
        "alagard",
        "alagard"
      );
      Phaser.GameObjects.BitmapText.ParseFromAtlas(
        this,
        "feedMe",
        "atlas",
        "feedMe",
        "feedMe"
      );
      //this.scene.launch(SCENE.HUD);
      this.scene.start(SCENE.MENU);
    } else {
      this.loadingMessage =
        "Some files failed to load. Please reload the page.";
    }
  }
}

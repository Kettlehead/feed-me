import Phaser from "phaser";
import { SCENE } from "./index";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.MENU });
  }

  create() {
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "atlas",
      "title"
    );
  }
}

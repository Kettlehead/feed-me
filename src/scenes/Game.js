import Phaser from "phaser";
import { SCENE } from "./index";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x263d0a);
  }
}

import Phaser from "phaser";
import { SCENE } from "./index";

export default class Settings extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.SETTINGS });
  }

  create() {}
}

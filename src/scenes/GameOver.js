import Phaser from "phaser";
import { SCENE } from "./index";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.GAME_OVER });
  }

  create() {}
}

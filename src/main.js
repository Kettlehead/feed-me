import Phaser from "phaser";

import Preload from "./scenes/Preload";
import Menu from "./scenes/Menu";
import Settings from "./scenes/Settings";
import Game from "./scenes/Game";
import GameOver from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser",
    width: 800,
    height: 600,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: [Preload, Menu, Settings, Game, GameOver],
};

export default new Phaser.Game(config);

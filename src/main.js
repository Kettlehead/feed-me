import Phaser from "phaser";

import Preload from "./scenes/Preload";
import Menu from "./scenes/Menu";
import Intro from "./scenes/Intro";
//import Settings from "./scenes/Settings";
import Game from "./scenes/Game";
import HUD from "./scenes/HUD";
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
    arcade: {
      debug: false,
    },
  },
  scene: [Preload, Menu, Intro, HUD, Game, GameOver],
};

export default new Phaser.Game(config);

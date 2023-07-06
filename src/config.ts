import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'
import { HUDScene } from './scenes/hud-scene'
import { MenuScene } from './scenes/menu-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Super Mario Land',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    width: window.innerWidth / 3,
    height: window.innerHeight / 3,
    zoom: 3,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [BootScene, MenuScene, HUDScene, GameScene],
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 475 },
            debug: false,
        },
    },
    backgroundColor: '#03cafc',
    render: { pixelArt: true, antialias: false },
}

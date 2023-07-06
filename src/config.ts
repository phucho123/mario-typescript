import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { HUDScene } from './scenes/HUDScene'
import { MenuScene } from './scenes/MenuScene'

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

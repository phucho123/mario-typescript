export interface IBoxConstructor {
    scene: Phaser.Scene
    content: string
    x: number
    y: number
    texture: string
    frame?: string | number
}

export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        if (this.input.keyboard)
            this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
        this.initGlobalDataManager()
    }

    create(): void {
        const image = this.add.image(0, 0, 'title').setOrigin(0, 0)
        image.displayWidth = this.sys.canvas.width
        image.displayHeight = this.sys.canvas.height

        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height * 0.8,
                'font',
                'START',
                16
            )
        )
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start('HUDScene')
            this.scene.start('GameScene')
            this.scene.bringToTop('HUDScene')
        }
    }

    private initGlobalDataManager(): void {
        this.registry.set('time', 400)
        this.registry.set('level', 'myLevel1')
        this.registry.set('world', '1-1')
        this.registry.set('worldTime', 'WORLD TIME')
        this.registry.set('score', 0)
        this.registry.set('coins', 0)
        this.registry.set('lives', 2)
        this.registry.set('spawn', { x: 32, y: 44, dir: 'down' })
        this.registry.set('marioSize', 'small')
        this.registry.set('flowers', 0)
    }
}

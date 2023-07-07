import { ISpriteConstructor } from '../interfaces/sprite.interface'

export class Projectile extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    // variables
    protected currentScene: Phaser.Scene
    protected isActivated: boolean
    protected isDying: boolean
    protected speed: number
    protected dyingScoreValue: number
    private shotting: boolean

    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        // variables
        this.shotting = true
        this.currentScene = aParams.scene
        this.initSprite()
        this.currentScene.add.existing(this)
    }

    protected initSprite() {
        // variables
        this.isActivated = false
        this.isDying = false

        // sprite
        this.setOrigin(0, 0)
        this.setFrame(0)

        // physics
        this.currentScene.physics.world.enable(this)
        this.setScale(16 / this.displayWidth, 8 / this.displayHeight).setAlpha(0)
        this.body.setSize(16, 8)
        this.body.setAllowGravity(false)
        // this.body.setSize(this.displayWidth, this.displayHeight)
    }

    public shot(x: number, y: number, flipX: boolean) {
        if (this.shotting) {
            this.shotting = false
            this.setAlpha(1)
            this.y = y
            this.setFlipX(flipX)
            if (flipX) {
                this.x = x - 8
                this.body.setAccelerationX(-2000)
            } else {
                this.x = x + 8
                this.body.setAccelerationX(2000)
            }
        }
    }

    public stopShot() {
        this.setAlpha(0)
        this.shotting = true
        this.body.setAccelerationX(0)
        this.body.setVelocityX(0)
    }

    public update(): void {
        ///
        if (this.x > this.currentScene.sys.canvas.width || this.x < 0) this.stopShot()
    }
}

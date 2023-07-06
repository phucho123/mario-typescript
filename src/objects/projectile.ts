import { IPlatformConstructor } from '../interfaces/platform.interface'

export class Projectile extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body
    private shotTween: Phaser.Tweens.Tween

    // variables
    private currentScene: Phaser.Scene
    //   private tweenProps: any;
    private shotting: boolean

    constructor(aParams: IPlatformConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        // variables
        this.currentScene = aParams.scene
        // this.tweenProps = aParams.tweenProps;

        this.initImage()
        // this.initTween();
        this.currentScene.add.existing(this)
        this.shotting = true
    }

    private initImage(): void {
        // image
        this.setOrigin(0, 0)
        this.setFrame(0)

        // physics
        this.currentScene.physics.world.enable(this)
        this.body.setSize(16, 8)
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.setScale(16 / this.displayWidth, 8 / this.displayHeight).setAlpha(0)
    }

    private initTween(x: number, y: number, flipX: boolean, tweenProps: any): void {
        this.x = x
        this.y = y
        this.setFlipX(flipX)
        this.shotTween = this.currentScene.tweens.add({
            targets: this,
            props: tweenProps,
            ease: 'Power0',
            yoyo: false,
            repeat: 0,
            onComplete: () => {
                this.shotting = true
            },
        })
    }

    public shot(x: number, y: number, flipX: boolean, tweenProps: any) {
        if (this.shotting) {
            this.shotting = false
            this.setAlpha(1)
            this.initTween(x, y, flipX, tweenProps)
        }
    }

    public stopShot() {
        this.setAlpha(0)
        this.currentScene.tweens.remove(this.shotTween)
        this.shotting = true
    }

    update(): void {
        ///
    }
}

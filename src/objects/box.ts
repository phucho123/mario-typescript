import { Collectible } from './collectible'
import { IBoxConstructor } from '../interfaces/box.interface'

export class Box extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    // variables
    private currentScene: Phaser.Scene
    private boxContent: string
    private content: Collectible | null
    private hitBoxTimeline: Phaser.Time.Timeline

    public getContent(): Phaser.GameObjects.Sprite | null {
        return this.content
    }

    public getBoxContentString(): string {
        return this.boxContent
    }

    constructor(aParams: IBoxConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        // variables
        this.currentScene = aParams.scene
        this.boxContent = aParams.content

        this.initSprite()
        this.currentScene.add.existing(this)
    }

    private initSprite() {
        // variables
        this.content = null
        this.hitBoxTimeline = this.currentScene.add.timeline({})

        // sprite
        this.setOrigin(0, 0)
        this.setFrame(0)

        // physics
        this.currentScene.physics.world.enable(this)
        this.body.setSize(16, 16)
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
    }

    update(): void {
        ///
    }

    public yoyoTheBoxUpAndDown(): void {
        this.hitBoxTimeline.add([
            {
                tween: {
                    targets: this,
                    props: { y: this.y - 10 },
                    duration: 60,
                    ease: 'Power0',
                    yoyo: true,
                    onComplete: () => {
                        this.active = false
                        this.setFrame(1)
                    },
                },
            },
        ])
    }

    public spawnBoxContent(): Collectible {
        this.content = new Collectible({
            scene: this.currentScene,
            x: this.x,
            y: this.y - 16,
            texture: this.boxContent,
            points: 1000,
        })
        return this.content
    }

    public tweenBoxContent(props: any, duration: number, complete: () => void): void {
        this.hitBoxTimeline.add([
            {
                tween: {
                    targets: this.content,
                    props: props,
                    delay: 0,
                    duration: duration,
                    ease: 'Power0',
                    onComplete: complete,
                },
            },
        ])
    }

    public startHitTimeline(): void {
        this.hitBoxTimeline.play()
    }

    public popUpCollectible(): void {
        if (this.content) {
            this.content.body.setVelocity(30, -50)
            this.content.body.setAllowGravity(true)
            this.content.body.setGravityY(-300)
        }
    }

    public addCoinAndScore(coin: number, score: number): void {
        this.currentScene.registry.values.coins += coin
        this.currentScene.events.emit('coinsChanged')
        this.currentScene.registry.values.score += score
        this.currentScene.events.emit('scoreChanged')
    }
}

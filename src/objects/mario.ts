import { ISpriteConstructor } from '../interfaces/sprite.interface'
import { Projectile } from './projectile'

export class Mario extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    // variables
    private currentScene: Phaser.Scene
    private marioSize: string
    private acceleration: number
    private isJumping: boolean
    private isDying: boolean
    private isVulnerable: boolean
    private vulnerableCounter: number
    private projectiles: Projectile
    private life: number

    // input
    private keys: Map<string, Phaser.Input.Keyboard.Key>

    public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
        return this.keys
    }

    public getVulnerable(): boolean {
        return this.isVulnerable
    }

    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.currentScene = aParams.scene
        this.initSprite()
        this.currentScene.add.existing(this)
        this.projectiles = new Projectile({
            scene: this.currentScene,
            x: this.x,
            y: this.y,
            texture: 'projectile',
            tweenProps: {
                y: {
                    value: 50,
                    duration: 1500,
                    ease: 'Power0',
                },
            },
        })
    }

    private initSprite() {
        // variables
        this.marioSize = this.currentScene.registry.get('marioSize')
        this.acceleration = 1000 //500
        this.isJumping = false
        this.isDying = false
        this.isVulnerable = true
        this.vulnerableCounter = 100
        this.life = this.currentScene.registry.get('marioLife')

        // sprite
        this.setOrigin(0.5, 0.5)
        this.setFlipX(false)

        // input
        this.keys = new Map([
            ['LEFT', this.addKey('LEFT')],
            ['RIGHT', this.addKey('RIGHT')],
            ['DOWN', this.addKey('DOWN')],
            ['JUMP', this.addKey('SPACE')],
            ['SHOT', this.addKey('d')],
        ]) as Map<string, Phaser.Input.Keyboard.Key>

        // physics
        this.currentScene.physics.world.enable(this)
        if (this.marioSize == 'small') this.adjustPhysicBodyToSmallSize()
        else this.adjustPhysicBodyToBigSize()
        this.body.maxVelocity.x = 100
        this.body.maxVelocity.y = 300
    }

    private addKey(key: string): Phaser.Input.Keyboard.Key | undefined {
        if (this.currentScene.input.keyboard) return this.currentScene.input.keyboard.addKey(key)
    }

    update(): void {
        if (!this.isDying) {
            this.handleInput()
            this.handleAnimations()
        } else {
            // this.setFrame(12);
            this.setFrame(3)
            if (this.y > 288) {
                //this.currentScene.sys.canvas.height
                this.currentScene.scene.stop('GameScene')
                this.currentScene.scene.stop('HUDScene')
                this.currentScene.scene.start('MenuScene')
            }
        }

        if (!this.isVulnerable) {
            if (this.vulnerableCounter > 0) {
                this.vulnerableCounter -= 1
            } else {
                this.vulnerableCounter = 100
                this.isVulnerable = true
            }
        }
    }

    private handleInput() {
        if (this.y > 288) {
            // mario fell into a hole
            this.isDying = true
        }

        // evaluate if player is on the floor or on object
        // if neither of that, set the player to be jumping
        if (this.body.onFloor() || this.body.touching.down || this.body.blocked.down) {
            this.isJumping = false
            this.body.setVelocityY(0)
        }

        // handle movements to left and right
        const right = this.keys.get('RIGHT'),
            left = this.keys.get('LEFT')
        if (right && right.isDown) {
            this.body.setAccelerationX(this.acceleration)
            this.setFlipX(false)
        } else if (left && left.isDown) {
            this.body.setAccelerationX(-this.acceleration)
            this.setFlipX(true)
        } else {
            this.body.setVelocityX(0)
            this.body.setAccelerationX(0)
        }

        // handle jumping
        const jump = this.keys.get('JUMP')
        if (jump && jump.isDown && !this.isJumping) {
            this.body.setVelocityY(-360) //-180
            this.isJumping = true
        }

        //handle Shotting
        const shot = this.keys.get('SHOT')
        if (shot && shot.isDown) {
            this.projectiles.shot(this.x, this.y, this.flipX, {
                x: {
                    value: this.x + (this.flipX ? -500 : 500),
                    duration: 3000,
                    ease: 'Power0',
                },
                alpha: {
                    value: 0,
                    duration: 3000,
                    ease: 'Power0',
                },
            })
        }
    }

    private handleAnimations(): void {
        if (this.body.velocity.y !== 0) {
            // mario is jumping or falling
            this.anims.stop()
            if (this.marioSize === 'small') {
                // this.setFrame(4);
                this.setFrame(2)
            } else {
                // this.setFrame(10);
                this.setFrame(2)
            }
        } else if (this.body.velocity.x !== 0) {
            // mario is moving horizontal

            // check if mario is making a quick direction change
            if (
                (this.body.velocity.x < 0 && this.body.acceleration.x > 0) ||
                (this.body.velocity.x > 0 && this.body.acceleration.x < 0)
            ) {
                if (this.marioSize === 'small') {
                    // this.setFrame(5);
                    this.setFrame(1)
                } else {
                    this.setFrame(1)
                    // this.setFrame(11);
                }
            }

            if (this.body.velocity.x > 0) {
                this.anims.play(this.marioSize + 'MarioColorWalk', true)
            } else {
                this.anims.play(this.marioSize + 'MarioColorWalk', true)
            }
        } else {
            // mario is standing still
            this.anims.stop()
            if (this.marioSize === 'small') {
                this.setFrame(0)
            } else {
                const down = this.keys.get('DOWN')
                if (down && down.isDown) {
                    this.setFrame(13)
                } else {
                    // this.setFrame(6);
                    this.setFrame(0)
                }
            }
        }
    }

    public growMario(): void {
        this.marioSize = 'big'
        this.currentScene.registry.set('marioSize', 'big')
        this.adjustPhysicBodyToBigSize()
    }

    private shrinkMario(): void {
        this.marioSize = 'small'
        this.currentScene.registry.set('marioSize', 'small')
        this.adjustPhysicBodyToSmallSize()
    }

    private adjustPhysicBodyToSmallSize(): void {
        // this.body.setSize(6, 12);
        // this.body.setOffset(6, 4);
        this.setTexture('marioColor')
        this.body.setSize(10, 16)
        this.body.setOffset(6, 2)
        // this.body.setOffset(6, 4);
    }

    private adjustPhysicBodyToBigSize(): void {
        // this.body.setSize(8, 16);
        // this.body.setOffset(4, 0);
        this.setTexture('bigMarioColor')
        this.body.setSize(10, 36)
        this.body.setOffset(6, 0)
    }

    public bounceUpAfterHitEnemyOnHead(): void {
        this.currentScene.add.tween({
            targets: this,
            props: { y: this.y - 10 },
            duration: 200,
            ease: 'Power1',
            yoyo: true,
        })
    }

    public gotHit(): void {
        this.isVulnerable = false
        if (this.marioSize === 'big') {
            this.shrinkMario()
        } else if (this.life > 0) {
            this.life--
            this.currentScene.registry.set('marioLife', this.life)
            this.currentScene.tweens.add({
                targets: this,
                alpha: 0,
                yoyo: true,
                repeat: 3,
                duration: 100,
            })
        } else {
            // mario is dying
            this.isDying = true

            // sets acceleration, velocity and speed to zero
            // stop all animations
            this.body.stop()
            this.anims.stop()

            // make last dead jump and turn off collision check
            this.body.setVelocityY(-360) //-180

            // this.body.checkCollision.none did not work for me
            this.body.checkCollision.up = false
            this.body.checkCollision.down = false
            this.body.checkCollision.left = false
            this.body.checkCollision.right = false
        }
    }

    public getProjectiles(): Projectile {
        return this.projectiles
    }

    public increaseLife() {
        this.life++
        this.currentScene.registry.set('marioLife', this.life)
    }
}

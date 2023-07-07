import { Enemy } from './Enemy'
import { ISpriteConstructor } from '../interfaces/sprite.interface'

export class Goomba extends Enemy {
    body: Phaser.Physics.Arcade.Body

    constructor(aParams: ISpriteConstructor) {
        super(aParams)
        this.speed = -40
        this.dyingScoreValue = 100
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // goomba is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed)

                // if goomba is moving into obstacle from map layer, turn
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.speed = -this.speed
                    this.body.velocity.x = this.speed
                    if (this.body.blocked.right) {
                        this.setFlipX(false)
                    } else {
                        this.setFlipX(true)
                    }
                }

                // apply walk animation
                this.anims.play('goombaColorWalk', true)
            } else {
                if (
                    Phaser.Geom.Intersects.RectangleToRectangle(
                        this.getBounds(),
                        this.currentScene.cameras.main.worldView
                    )
                ) {
                    this.isActivated = true
                }
            }
        } else {
            // goomba is dying, so stop animation, make velocity 0 and do not check collisions anymore
            this.anims.stop()
            this.body.setVelocity(0, 0)
            this.body.checkCollision.none = true
        }
    }

    public gotHitOnHead(): void {
        this.isDying = true
        this.setFrame(2)
        this.showAndAddScore()
    }

    public gotHitFromBulletOrMarioHasStar(): void {
        this.isDying = true
        this.body.setVelocityX(40)
        this.body.setVelocityY(-40)
        this.setFlipY(true)
        this.showAndAddScore()
    }

    public isDead(): void {
        this.destroy()
    }
}

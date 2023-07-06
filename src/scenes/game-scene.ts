import { Box } from '../objects/box'
import { Brick } from '../objects/brick'
import { Collectible } from '../objects/collectible'
import { Dino } from '../objects/dino'
import { Goomba } from '../objects/goomba'
import { Mario } from '../objects/mario'
import { Platform } from '../objects/platform'
import { Portal } from '../objects/portal'
import { Projectile } from '../objects/projectile'

export class GameScene extends Phaser.Scene {
    // tilemap
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer

    // game objects
    private boxes: Phaser.GameObjects.Group
    private bricks: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group
    private enemies: Phaser.GameObjects.Group
    private platforms: Phaser.GameObjects.Group
    private player: Mario
    private portals: Phaser.GameObjects.Group

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        ///
    }

    create(): void {
        // *****************************************************************
        // SETUP TILEMAP
        // *****************************************************************

        // create our tilemap from Tiled JSON
        this.map = this.make.tilemap({ key: this.registry.get('level') })
        // add our tileset and layers to our tilemap
        // this.tileset = this.map.addTilesetImage('tiles');
        this.tileset = this.map.addTilesetImage('blocks') as Phaser.Tilemaps.Tileset
        this.backgroundLayer = this.map.createLayer(
            'backgroundLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer

        this.foregroundLayer = this.map.createLayer(
            'foregroundLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer
        this.foregroundLayer.setName('foregroundLayer')

        // set collision for tiles with the property collide set to true
        this.foregroundLayer.setCollisionByProperty({ collide: true })

        // *****************************************************************
        // GAME OBJECTS
        // *****************************************************************
        this.portals = this.add.group({
            /*classType: Portal,*/
            runChildUpdate: true,
        })

        this.boxes = this.add.group({
            /*classType: Box,*/
            runChildUpdate: true,
        })

        this.bricks = this.add.group({
            /*classType: Brick,*/
            runChildUpdate: true,
        })

        this.collectibles = this.add.group({
            /*classType: Collectible,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            runChildUpdate: true,
        })

        this.platforms = this.add.group({
            /*classType: Platform,*/
            runChildUpdate: true,
        })

        this.loadObjectsFromTilemap()

        // *****************************************************************
        // COLLIDERS
        // *****************************************************************
        this.physics.add.collider(this.player, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.boxes)
        this.physics.add.collider(this.enemies, this.bricks)
        this.physics.add.collider(this.player, this.bricks)
        this.physics.add.collider(this.player.getProjectiles(), this.foregroundLayer)

        this.physics.add.collider(
            this.player,
            this.boxes,
            this.playerHitBox as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player.getProjectiles(),
            this.enemies,
            this.handleProjectileEnemyOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.portals,
            this.handlePlayerPortalOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player,
            this.platforms,
            this.handlePlayerOnPlatform as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.collectibles,
            this
                .handlePlayerCollectiblesOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        // *****************************************************************
        // CAMERA
        // *****************************************************************
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    }

    update(): void {
        this.player.update()
    }

    private loadObjectsFromTilemap(): void {
        // get the object layer in the tilemap named 'objects'
        const tmp = this.map.getObjectLayer('objects')
        if (!tmp) return
        const objects = tmp.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'portal') {
                this.portals.add(
                    new Portal({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        height: object.width,
                        width: object.height,
                        spawn: {
                            x: object.properties[1].value,
                            y: object.properties[2].value,
                            dir: object.properties[0].value,
                        },
                    }).setName(object.name)
                )
            }

            if (object.type === 'player') {
                this.player = new Mario({
                    scene: this,
                    x: this.registry.get('spawn').x,
                    y: this.registry.get('spawn').y,
                    texture: 'marioColor',
                })
            }

            if (object.type === 'goomba') {
                this.enemies.add(
                    new Goomba({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'goombaColor',
                    })
                )
            }

            if (object.type == 'dino') {
                this.enemies.add(
                    new Dino({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'dino',
                    })
                )
            }

            if (object.type === 'brick') {
                this.bricks.add(
                    new Brick({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'brick',
                        value: 50,
                    })
                )
            }

            if (object.type === 'box') {
                this.boxes.add(
                    new Box({
                        scene: this,
                        content: object.properties[0].value,
                        // content: object.properties.content,
                        x: object.x,
                        y: object.y,
                        texture: 'box',
                    })
                )
            }

            if (object.type === 'collectible') {
                this.collectibles.add(
                    new Collectible({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: object.properties[0].value,
                        // texture:object.properties.kindOfCollectible,
                        points: 100,
                    })
                )
            }

            if (object.type === 'platformMovingUpAndDown') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            y: {
                                value: 50,
                                duration: 1500,
                                ease: 'Power0',
                            },
                        },
                    })
                )
            }

            if (object.type === 'platformMovingLeftAndRight') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            x: {
                                value: object.x + 50,
                                duration: 1200,
                                ease: 'Power0',
                            },
                        },
                    })
                )
            }
        })
    }

    /**
     * Player <-> Enemy Overlap
     * @param _player [Mario]
     * @param _enemy  [Enemy]
     */
    private handlePlayerEnemyOverlap(_player: Mario, _enemy: Goomba): void {
        if (_player.body.touching.down && _enemy.body.touching.up) {
            // player hit enemy on top
            _player.bounceUpAfterHitEnemyOnHead()
            _enemy.gotHitOnHead()
            this.add.tween({
                targets: _enemy,
                props: { alpha: 0 },
                duration: 1000,
                ease: 'Power0',
                yoyo: false,
                onComplete: function () {
                    _enemy.isDead()
                },
            })
        } else {
            // player got hit from the side or on the head
            if (_player.getVulnerable()) {
                _player.gotHit()
            }
        }
    }

    private handleProjectileEnemyOverlap(_projectile: Projectile, _enemy: Goomba): void {
        if (_projectile.alpha) {
            _enemy.gotHitFromBulletOrMarioHasStar()
            _projectile.stopShot()
            this.add.tween({
                targets: _enemy,
                props: { alpha: 0 },
                duration: 1000,
                ease: 'Power0',
                yoyo: false,
                onComplete: function () {
                    _enemy.isDead()
                },
            })
        }
    }

    /**
     * Player <-> Box Collision
     * @param _player [Mario]
     * @param _box    [Box]
     */
    private playerHitBox(_player: Mario, _box: Box): void {
        if (_box.body.touching.down && _box.active) {
            // ok, mario has really hit a box on the downside
            _box.yoyoTheBoxUpAndDown()
            this.collectibles.add(_box.spawnBoxContent())

            switch (_box.getBoxContentString()) {
                // have a look what is inside the box! Christmas time!
                case 'coin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        const tmp = _box.getContent()
                        if (tmp) tmp.destroy()
                    })

                    _box.addCoinAndScore(1, 100)
                    break
                }
                case 'rotatingCoin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        const tmp = _box.getContent()
                        if (tmp) tmp.destroy()
                    })

                    _box.addCoinAndScore(1, 100)
                    break
                }
                case 'flower': {
                    _box.tweenBoxContent({ y: _box.y - 8 }, 200, function () {
                        const tmp = _box.getContent()
                        if (tmp) tmp.anims.play('flower')
                    })

                    break
                }
                case 'mushroom': {
                    _box.popUpCollectible()
                    break
                }
                case 'star': {
                    _box.popUpCollectible()
                    break
                }
                case 'heart': {
                    _box.popUpCollectible()
                    break
                }
                default: {
                    break
                }
            }
            _box.startHitTimeline()
        }
    }

    private handlePlayerPortalOverlap(_player: Mario, _portal: Portal): void {
        const down = _player.getKeys().get('DOWN'),
            right = _player.getKeys().get('RIGHT')
        if (down && right) {
            if (
                (down.isDown && _portal.getPortalDestination().dir === 'down') ||
                (right.isDown && _portal.getPortalDestination().dir === 'right')
            ) {
                // set new level and new destination for mario
                this.registry.set('level', _portal.name)
                this.registry.set('spawn', {
                    x: _portal.getPortalDestination().x,
                    y: _portal.getPortalDestination().y,
                    dir: _portal.getPortalDestination().dir,
                })

                // restart the game scene
                this.scene.restart()
            } else if (_portal.name === 'exit') {
                this.scene.stop('GameScene')
                this.scene.stop('HUDScene')
                this.scene.start('MenuScene')
            }
        }
    }

    private handlePlayerCollectiblesOverlap(_player: Mario, _collectible: Collectible): void {
        switch (_collectible.texture.key) {
            case 'flower': {
                break
            }
            case 'mushroom': {
                _player.growMario()
                break
            }
            case 'star': {
                break
            }
            case 'heart': {
                this.player.increaseLife()
                break
            }
            default: {
                break
            }
        }
        _collectible.collected()
    }

    // TODO!!!
    private handlePlayerOnPlatform(player: Mario, platform: Platform): void {
        if (platform.body.moves && platform.body.touching.up && player.body.touching.down) {
            ///
        }
    }
}

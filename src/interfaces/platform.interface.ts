import { TweenProps } from './tween-props.interface'

export interface IPlatformConstructor {
    scene: Phaser.Scene
    tweenProps: TweenProps
    x: number
    y: number
    texture: string
    frame?: string | number
}

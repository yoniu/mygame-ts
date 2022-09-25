export class PlayScene extends Phaser.Scene {
  private score = 0
  private bricks
  private scoreText?: Phaser.GameObjects.Text
  private ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  private paddle!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

  constructor() {
    super("PlayScene")
  }

  init(): void {
  }

  create(): void {
    // 定义游戏边界
    this.physics.world.setBoundsCollision(true, true, true, false)
    // 创建砖块组
    this.bricks = this.physics.add.staticGroup({
      key: 'assets',
      frame: ['blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1'],
      frameQuantity: 10,
      gridAlign: {
        width: 10, 
        height: 6,
        cellWidth: 64,
        cellHeight: 32,
        x: 112,
        y: 100
      }
    })
    // 分数显示
    this.scoreText = this.add.text(
      80, 30, 'Score:0', {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '46px'
      }
    )
    // 添加小球
    this.ball = this.physics.add
      .image(400, 500, "assets", "ball1")
      .setCollideWorldBounds(true) // 设置碰撞
      .setBounce(1).setData("onPaddle", true) // 设置小球在移动板块上
    // 添加移动板块
    this.paddle = this.physics.add
      .image(400, 540, "assets", "paddle1")
      .setImmovable() // 设定此实体在与其他实体碰撞期间可以分离
    // 添加碰撞事件
    this.physics.add.collider(
      this.ball,
      this.bricks, // 与砖块碰撞
      this.hitBrick,
      null,
      this
    )
    this.physics.add.collider(
      this.ball,
      this.paddle, // 与移动板块碰撞
      this.hitPaddle,
      null,
      this
    )

    // 鼠标移动事件
    this.input.on("pointermove",(pointer) => {
      //  Keep the paddle within the game
      this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748) // 设置移动板块位置，Clamp 设定只能在 52-748 取值
      if (this.ball.getData("onPaddle")) // 判断小球是否在移动板块上
        this.ball.x = this.paddle.x
    }, this)
    // 鼠标点击事件
    this.input.on("pointerup", () => {
      if (this.ball.getData("onPaddle")) { // 判断小球是否在移动板块上
        this.ball.setVelocity(75, -300) // 设置小球速度
        this.ball.setData("onPaddle", false) // 设置小球不在移动板块上
      }
    }, this)


  }

  update(): void {
    
  }
  hitBrick(ball:Phaser.Types.Physics.Arcade.ImageWithDynamicBody, brick:Phaser.Types.Physics.Arcade.ImageWithStaticBody) {
    this.score += 10 // 打击砖块加 10 分
    this.scoreText?.setText('Score:'+this.score) // 更新得分
    brick.disableBody(true, true) // 隐藏被打击砖块
    
    if (this.bricks.countActive() === 0) { // 如果没有砖块了
      //this.resetLevel();
    }
  }
  hitPaddle(ball:Phaser.Types.Physics.Arcade.ImageWithDynamicBody, paddle:Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    let diff = 0
    if (Math.abs(ball.x - paddle.x) > 2) {
      diff = ball.x - paddle.x
      ball.setVelocityX(-10 * diff)
    } else {
      //  Add a little random X to stop it bouncing straight up!
      ball.setVelocityX(2 + Math.random() * 8)
    }
  }
  
}

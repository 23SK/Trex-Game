var ground, trex, invGround;
var trexRunning;
var groundImg;
var cloud, cloudImg;
var cloudGroup, obstacleGroup
var PLAY = 1;
var END = 0;
var gameState = PLAY
var score = 0;
var jumpSound, dieSound, checkpointSound;
var gameOver, restart;
var gameOverImg, restartImg;

function preload() {

  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollide = loadAnimation("trex_collided.png");

  groundImg = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  ground = createSprite(width/2,height-20,width,10);
  ground.x = ground.width / 2;
  ground.addImage("g", groundImg);

  invGround = createSprite(width/2,height-25,width,10);
  invGround.visible = false;

  trex = createSprite(50, 160, 25, 50);
  trex.addAnimation("tr", trexRunning);
  trex.addAnimation("tc", trexCollide);
  trex.scale = 0.6;

  cloudGroup = new Group();
  obstacleGroup = new Group();

  gameOver = createSprite(width/2,height/2-50,30,30);
  gameOver.addImage("go", gameOverImg);
  restart = createSprite(width/2,height/2,15,15);
  restart.scale = 0.5
  restart.addImage("r", restartImg);
}

function draw() {
  background(170);

  trex.debug = true;
  //trex.setCollider("circle",0,0,30);
  trex.setCollider("rectangle", 0, 0, 100, trex.height);

  text("score" + score, width-125,20);

  if (gameState == PLAY) {

    gameOver.visible = false
    restart.visible = false

    score = score + Math.round(frameCount / 60)
    ground.velocityX = -3;
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    if (touches.length>0||keyDown("space") && trex.y > height-150) {
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }
    trex.velocityY += 0.5;

    if (score > 0 && score % 100 == 0) {
      checkpointSound.play();
    }

    if (frameCount % 60 == 0) {
      spawnClouds();
    }

    if (frameCount % 120 == 0) {
      spawnObstacles();
    }

    if (obstacleGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
      // applying AI
      //trex.velocityY = -10
      //jumpSound.play();


    }
    //trex.velocityY += 0.5;

  } else if (gameState == END) {
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("tc");
    gameOver.visible = true
    restart.visible = true
    if (mousePressedOver(restart)) {
      console.log("hi");
      restartGame();

    }
  }

  trex.collide(invGround);

  drawSprites();
}

function spawnClouds() {
  cloud = createSprite(width,height-300,40,10);
  cloud.addImage("c", cloudImg);
  cloud.velocityX = -3;
  cloud.scale = 0.75;
  cloud.y = Math.round(random(10, 60))
  trex.depth = cloud.depth + 1;
  console.log(trex.depth);
  console.log(cloud.depth);
  cloud.lifetime = -width/cloud.velocityX;
  cloudGroup.add(cloud);
}

function spawnObstacles() {
  obstacle = createSprite(width,height-40,10,40);
  obstacle.velocityX = -3; 
  obstacle.scale = 0.6
  obstacle.lifetime = -width/obstacle.velocityX;
  var rn = Math.round(random(1, 6))
  switch (rn) {
    case 1:
      obstacle.addImage(obstacle1);
      break;

    case 2:
      obstacle.addImage(obstacle2);
      break;

    case 3:
      obstacle.addImage(obstacle3);
      break;

    case 4:
      obstacle.addImage(obstacle4);
      break;

    case 5:
      obstacle.addImage(obstacle5);
      break;

    case 6:
      obstacle.addImage(obstacle6);
      break;
  }
  obstacleGroup.add(obstacle)
}

function restartGame() {
  gameState = PLAY;

  score = 0;

  gameOver.visible = false;
  restart.visible = false;

  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();

  trex.changeAnimation("tr", trexRunning);
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundY = canvas.height - 100;

const playerImg = new Image();
playerImg.src = "rana.png";

const jumpSound = new Audio("croak.wav");
jumpSound.volume = 0.3;

const player = {
  x: 100,
  y: 100,
  width: 70,
  height: 70,
  velocityY: 0,
  gravity: 0.8,
  jumpForce: -18,
  isOnGround: false
};

let score = 0;
let gameOver = false;

let obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 45;
let obstacleSpeed = 5;
let minDistance = 200;

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (gameOver) return;

  obstacleSpeed += 0.001;

  obstacles.forEach(obstacle => {
  if (!obstacle.scored && obstacle.x + obstacle.width < player.x) {
    score += 1;
    obstacle.scored = true;
  }
});


  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
  } else {
    player.isOnGround = false;
  }

  if (
    obstacles.length === 0 ||
    canvas.width - obstacles[obstacles.length - 1].x > minDistance
  ) {
    if (Math.random() < 0.03 + obstacleSpeed * 0.002) {

      
      minDistance = 250 + Math.random() * 150;

      
      if (minDistance > 80) {
        minDistance -= score * 0.01;
      }

      obstacles.push({
        x: canvas.width,
        y: groundY - obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight,
        scored: false 
      });
    }
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= obstacleSpeed;
  });

  obstacles = obstacles.filter(o => o.x + o.width > 0);

  obstacles.forEach(obstacle => {
    if (isColliding(player, obstacle)) {
      gameOver = true;
    }
  });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


function draw() {
  ctx.fillStyle = "#ffe5ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#426b69";
  ctx.fillRect(0, groundY, canvas.width, 5);

  ctx.drawImage(playerImg, player.x, player.y + 5, player.width, player.height);

  ctx.fillStyle = "#800020";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + Math.floor(score), 20, 40);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText(
      "Press R to Restart",
      canvas.width / 2 - 100,
      canvas.height / 2 + 40
    );
  }
}

function restartGame() {
  player.y = 100;
  player.velocityY = 0;

  obstacles = [];
  score = 0;
  obstacleSpeed = 5;
  minDistance = 200;

  gameOver = false;
}

window.addEventListener("keydown", (e) => {
  if (
    (e.code === "Space" || e.code === "ArrowUp") &&
    player.isOnGround &&
    !gameOver
  ) {
    player.velocityY = player.jumpForce;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }

  if (e.code === "KeyR" && gameOver) {
    restartGame();
  }
});

gameLoop();
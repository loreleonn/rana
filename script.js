const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundY = canvas.height - 100;


const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.5,
  jumpForce: -12,
  isOnGround: false
};


let obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 45;
const obstacleSpeed = 5;

const minDistance = 250 + Math.random() * 150;


let gameOver = false;


function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}


function update() {
  if (gameOver) return;


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
  if (Math.random() < 0.025) {
    obstacles.push({
      x: canvas.width,
      y: groundY - obstacleHeight,
      width: obstacleWidth,
      height: obstacleHeight
    });
  }
}

  obstacles.forEach(obstacle => {
    obstacle.x -= obstacleSpeed;
  });

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#426b69";
  ctx.fillRect(0, groundY, canvas.width, 5);

  ctx.fillStyle = "#548c2f";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "#800020";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  if (gameOver) {
    ctx.fillStyle = "#426b69";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.isOnGround && !gameOver) {
    player.velocityY = player.jumpForce;
  }
});

gameLoop();
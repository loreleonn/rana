const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ground
const groundY = canvas.height - 100;

// Player
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

// Obstacles
let obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 45;
const obstacleSpeed = 5;

const minDistance = 250 + Math.random() * 150;

// Game state
let gameOver = false;

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update
function update() {
  if (gameOver) return;

  // Gravity
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Ground collision
  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
  } else {
    player.isOnGround = false;
  }

  // Spawn obstacles
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

  // Move obstacles
  obstacles.forEach(obstacle => {
    obstacle.x -= obstacleSpeed;
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  // Collision check
  obstacles.forEach(obstacle => {
    if (isColliding(player, obstacle)) {
      gameOver = true;
    }
  });
}

// Collision detection
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#426b69";
  ctx.fillRect(0, groundY, canvas.width, 5);

  // Player
  ctx.fillStyle = "#548c2f";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstacles
  ctx.fillStyle = "#800020";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Game Over text
  if (gameOver) {
    ctx.fillStyle = "#426b69";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Jump input
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.isOnGround && !gameOver) {
    player.velocityY = player.jumpForce;
  }
});

// Start
gameLoop();
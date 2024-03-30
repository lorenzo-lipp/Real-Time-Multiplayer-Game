import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { drawPlayer, drawBackground } from './assets.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
let self;
let players = [];
let keysPressed = {};
let collectible;
let lastRank;
let nextMove = [];

socket.on('create-self', data => {
  self = new Player(data);
  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyPressed);
  socket.emit('self-created', self);
});

socket.on('update-players', data => {
  players = data.players;
  paintGame();
});

socket.on('update-collectible', data => {
  collectible = new Collectible(data);
  paintGame();
});

function keyPressed(e) {
  switch(e.key) {
    case "w":
    case "ArrowUp":
      keysPressed["up"] = e.type === "keydown";
      keysPressed["down"] = e.type === "keydown" ? false : keysPressed["down"];
      break;
    case "s":
    case "ArrowDown":
      keysPressed["down"] = e.type === "keydown";
      keysPressed["up"] = e.type === "keydown" ? false : keysPressed["up"];
      break;
    case "a":
    case "ArrowLeft":
      keysPressed["left"] = e.type === "keydown";
      keysPressed["right"] = e.type === "keydown" ? false : keysPressed["right"];
      break;
    case "d":
    case "ArrowRight":
      keysPressed["right"] = e.type === "keydown";
      keysPressed["left"] = e.type === "keydown" ? false : keysPressed["left"];
      break;
  }
}

move();

function move() {
  setTimeout(() => {
    let didMove = false;
    let speed = Object.keys(keysPressed).filter(v => keysPressed[v] === true).length > 1 ? 5 : 10;
    move();

    for (let key in keysPressed) {
      if (keysPressed[key]) {
        if (key === "down" && self.y >= 435) return false;
        if (key === "up" && self.y <= 85) return false;
        if (key === "left" && self.x <= 25) return false;
        if (key === "right" && self.x >= 600) return false;
        self.movePlayer(key, speed);
        didMove = true;
      };
    }

    if (!didMove) return false;

    socket.emit('player-move', self);
    if (collectible && self.collision(collectible)) {
      self.score += collectible.value;
      collectible = false;
      socket.emit('collect', self);
    }
  }, 100);
}

function paintPlayer(playerData) {
  drawPlayer(context, playerData, playerData.id === self.id);
}

function paintCollectible(collectibleData) {
  if (collectibleData) {
    collectibleData.draw(context);
  }
}

function paintRank(rank) {
  context.font = "14px 'Press Start 2P'"
  lastRank = rank.includes(": 0/") ? lastRank : rank;
  context.fillText(lastRank, 460, 40);
}

function paintScore(score) {
  context.font = "14px 'Press Start 2P'"
  context.fillText("Score: " + score, 280, 40);
}

function paintInfo() {
  context.font = "14px 'Press Start 2P'"
  context.fillText("Controls: WASD", 40, 40);
}

function paintGame() {
  drawBackground(context);
  
  context.clearRect(0, 0, 640, 64);
  paintInfo();
  paintRank(self.calculateRank(players));
  paintScore(self.score);

  for (let player of players) {
    paintPlayer(player);
  }

  paintCollectible(collectible);
}

'use strict';

const Game = require('../modules/Game.class');
const Grid = require('../modules/Grid.class');
const TunnelBackground = require('../modules/TunnelBackground.class')

const canvas = document.getElementById('tunnel-background');
const tunnelBackground = new TunnelBackground(canvas);

const gameElements = {
  score: document.querySelector('[data-score="score"]'),
  best: document.querySelector('[data-best="best"]'),
  start: document.querySelector('.button'),
  field: document.querySelector('.field'),
  messageWin: document.querySelector('.message__content--win'),
  messageLose: document.querySelector('.message__content--lose'),
  messageStart: document.querySelector('.message__content--start'),
  messageKeyboard: document.querySelector('.message__content--keyboard'),
};

const grid = new Grid(gameElements.field);
let countKeyPress = 0;
const game = new Game(grid.initializeBoard());
let bestScore = game.getBestScore();

if (gameElements.best) {
  gameElements.best.innerText = game.getBestScore();
}

if (gameElements.score) {
  gameElements.score.innerText = game.getScore();
}

function updateElement() {
  for (let r = 0; r < grid.size; r++) {
    for (let c = 0; c < grid.size; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = game.getState()[r][c];

      game.updateTile(tile, num);
    }
  }
  const currentScore = game.getScore();
  if (currentScore > bestScore) {
    bestScore = currentScore;
    game.setBestScore(bestScore);
    gameElements.best.innerText = bestScore;
  }
}

updateElement();

function handleStartGame() {
  if (gameElements.start.textContent === 'Start') {
    game.start();
    updateElement();
    game.updateScore(gameElements.score);
    gameElements.messageStart.classList.add('hidden');
    gameElements.messageKeyboard.classList.remove('hidden');
  }

  if (gameElements.start.textContent === 'New Game') {
    if (game.getStatus() === 'win') {
      gameElements.messageWin.classList.add('hidden');
    }

    if (game.getStatus() === 'lose') {
      gameElements.messageLose.classList.add('hidden');
    }
    game.restart();
    gameElements.start.innerText = 'Start';
    gameElements.start.classList.add('start');
    gameElements.start.classList.remove('restart');
    countKeyPress = 0;
    updateElement();
    game.updateScore(gameElements.score);
    gameElements.messageStart.classList.remove('hidden');
    gameElements.messageKeyboard.classList.add('hidden');
  }
}

gameElements.start.addEventListener('click', handleStartGame);

gameElements.messageStart.addEventListener('click', () => {
  handleStartGame();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  if (!gameElements.messageKeyboard.classList.contains('hidden')) {
    gameElements.messageKeyboard.classList.add('hidden');
  }
  
  switch (game.getStatus()) {
    case 'playing':
      switch (e.code) {
        case 'ArrowLeft':
          game.moveLeft();
          break;
        case 'ArrowRight':
          game.moveRight();
          break;
        case 'ArrowUp':
          game.moveUp();
          break;
        case 'ArrowDown':
          game.moveDown();
          break;
        default:
          break;
      }

      updateElement();
      countKeyPress++;
      break;
    case 'win':
      gameElements.messageWin.classList.remove('hidden');
      break;
    case 'lose':
      gameElements.messageLose.classList.remove('hidden');
      break;
    default:
      break;
  }

  game.updateScore(gameElements.score);

  const user = window.localStorage.getItem('user');

  game.setBestScore(game.getScore(), user);

  if (countKeyPress >= 1) {
    gameElements.start.innerText = 'New Game';
    gameElements.start.classList.remove('start');
    gameElements.start.classList.add('restart');
    gameElements.start.blur();
  }
});

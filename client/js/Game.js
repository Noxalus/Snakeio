'use strict';

const $ = require('jquery');

const Network = require('./Network');
const Cell = require('./Cell');
const Player = require('./Player');
const DIRECTION = require('./Direction');
const GameConfig = require('../../lib/Config');
const AbstractGame = require('../../lib/AbstractGame');
const Utils = require('../../lib/Utils');

class Game extends AbstractGame {
  constructor() {
    super();

    this.network = null;
    this.cells = [];
    this.player = null;
    this.score = 0;
    this.canvas = {
      canvas: null,
      context: null,
      width: 0,
      height: 0
    };
  }

  initialize() {
    this.initializeCanvas();
    this.initializeNetwork();

    this.reset();
  }

  reset() {
    this.cells = [];
    this.generateFood(10);

    if (this.player) {
      this.createPlayer(this.player.id);
    }

    this.score = 0;
  }

  initializeCanvas() {
    const c = $('#canvas')[0];

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    this.canvas.canvas = c;
    this.canvas.context = c.getContext('2d');
    this.canvas.width = $('#canvas').width();
    this.canvas.height = $('#canvas').height();
  }

  initializeNetwork() {
    this.network = new Network(this);
    this.network.initialize();
  }

  createPlayer(id) {
    const randomPosition = Utils.generateRandomPosition();

    this.player = new Player(id, randomPosition.x, randomPosition.y, GameConfig.player.defaultLength, this);
    this.player.initialize();
  }

  getCanvas() {
    return this.canvas;
  }

  generateFood(number) {
    if (typeof number === 'undefined') {
      number = 1;
    }

    for (let i = 0; i < number; i++) {
      const randomPosition = Utils.generateRandomPosition();
      const cell = new Cell(randomPosition.x, randomPosition.y);

      this.cells.push(cell);
    }
  }

  handleInput(event) {
    const key = event.which;

    if (key === 37 && this.player.currentDirection !== DIRECTION.RIGHT) {
      this.player.changeDirection(DIRECTION.LEFT);
    } else if (key === 38 && this.player.currentDirection !== DIRECTION.DOWN) {
      this.player.changeDirection(DIRECTION.UP);
    } else if (key === 39 && this.player.currentDirection !== DIRECTION.LEFT) {
      this.player.changeDirection(DIRECTION.RIGHT);
    } else if (key === 40 && this.player.currentDirection !== DIRECTION.UP) {
      this.player.changeDirection(DIRECTION.DOWN);
    }
  }

  checkFoodCollision() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.player.x === this.cells[i].x && this.player.y === this.cells[i].y) {
        this.cells.splice(i, 1);

        return true;
      }
    }

    return false;
  }

  increaseScore() {
    this.score++;
  }

  update(delta) {
    if (this.player) {
      this.player.update(delta);
    }
  }

  draw() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw(this.canvas.context);
    }

    // Draw player
    if (this.player) {
      this.player.draw();
    }

    const scoreText = 'Score: ' + this.score;

    $('#score').html(scoreText);
  }
}

module.exports = Game;
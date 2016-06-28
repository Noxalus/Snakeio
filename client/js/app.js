'use strict';

const MainLoop = require('mainloop.js');
const $ = require('jquery');

// CSS
require('!style!css!../css/main.css');

const Game = require('./Game');

let game = null;

$(document).ready(function() {
  game = new Game();
  game.initialize();

  MainLoop.setUpdate(game.update);
  MainLoop.setDraw(game.draw);

  MainLoop.start();
});
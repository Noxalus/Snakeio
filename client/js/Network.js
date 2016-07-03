'use strict';

const socketio = require('socket.io-client');
const Player = require('./Player');
const ClientConfig = require('./Config');

class Network {
  constructor(game) {
    this.socket = socketio();
    this.game = game;
    this.netLatency = 0;
    this.netPing = 0;
  }

  getPing() {
    return this.netPing;
  }

  initialize() {
    this.initializeEvents();

    // Ping the server
    const that = this;
    const pingInterval = setInterval(() => {
      const previousPing = new Date().getTime();
      that.socket.emit('clientPing', previousPing);
    }, ClientConfig.pingTimeout);
  }

  initializeEvents() {
    const that = this;

    this.socket.on('serverPing', (data) => {
      that.netPing = new Date().getTime() - data;
      that.netLatency = that.netPing / 2;
    });

    this.socket.on('onConnected', function(data) {
      that.onConnected(data);
    });

    this.socket.on('onPlayerJoined', function(data) {
      that.onPlayerJoined(data);
    });

    this.socket.on('onServerUpdate', function(data) {
      that.onServerUpdate(data);
    });

    this.socket.on('onPlayerRespawn', function(data) {
      that.onPlayerRespawn(data);
    });
  }

  onConnected(data) {
    console.log('onConnected', data);

    const player = new Player(data.id, data.name, data.position.x, data.position.y, data.body.length);
    player.setBody(data.body);
    player.setDirection(data.direction);

    this.game.setLocalPlayer(player);
  }

  onPlayerJoined(data) {
      console.log('onPlayerJoined: ', data);

      const player = new Player(data.id, data.name, data.position.x, data.position.y, data.body.length);
      player.setBody(data.body);
      player.setDirection(data.direction);

      this.game.addPlayer(player);
  }

  onServerUpdate(data) {
    // console.log('onServerUpdate', data);
    const serverTime = data.serverTime;

    // Naive approch
    if (true) {
      this.game.localPlayer.setBody(data.ownPlayer.body);
      this.game.localPlayer.setPosition(data.ownPlayer.position.x, data.ownPlayer.position.y);
      this.game.localPlayer.setDirection(data.ownPlayer.direction);

      for (const playerData of data.players) {
        const player = this.game.getPlayerById(playerData.id);

        player.setBody(playerData.body);
        player.setPosition(playerData.position.x, playerData.position.y);
        player.setDirection(playerData.direction);
      }
    }
  }

  onPlayerRespawn(data) {
    console.log('onPlayerRespawn: ', data);

    this.game.localPlayer.reset(data.position.x, data.position.y);
    this.game.localPlayer.setBody(data.body);
  }

  getNetLatency() {
    return this.netLatency;
  }

  getNetPing() {
    return this.netPing;
  }

  send(data) {
    this.socket.send(data);
  }
}

module.exports = Network;
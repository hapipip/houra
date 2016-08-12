'use strict';

const Fs = require('fs');
const Config = require('./config');

const internals = {
  getRegistrations() {
    let registrations = [];
    Fs.readdirSync(__dirname + '/plugins/manifests').forEach((fileName) => {
      if (fileName.endsWith('.js')) {
        registrations.push({
          plugin: JSON.parse(Fs.readFileSync(__dirname + '/plugins/manifests/' + fileName, {encoding: 'utf8'}))
        });
      }
    });

    return registrations;
  },

  getConnections() {
    return Config.connections;
  },

  getServer() {
    return Config.server;
  }
}

module.exports = {
  server: internals.getServer(),
  connections: internals.getConnections(),
  registrations: internals.getRegistrations()
};

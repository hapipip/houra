'use strict';

const Fs = require('fs');
const Config = require('./config');

const internals = {
  get registrations() {
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

  get connections() {
    return Config.connections;
  },

  get server() {
    return Config.server;
  }
};

module.exports = {
  server: internals.server,
  connections: internals.connections,
  registrations: internals.registrations
};

'use strict';

const Fs = require('fs');
const Yaml = require('nconf-yaml');
const Hoek = require('hoek');

const internals = {
  lock: false
};

module.exports = {
  load (path) {
    Hoek.assert(!internals.lock, 'You must load just one time the config');
    internals.lock = true;

    Fs.readdirSync(path).map((fileName) => {
      if (fileName.endsWith('.json')) {
        this[fileName.split('.')[0]] = JSON.parse(Fs.readFileSync(path + '/' + fileName, {encoding: 'utf8'}));
      }
      if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
        this[fileName.split('.')[0]] = Yaml.parse(Fs.readFileSync(path + '/' + fileName, {encoding: 'utf8'})).config;
      }
    });
  }
};

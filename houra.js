const Config = require('../config');
const Glue = require('glue');
const Fs = require('fs');

module.exports = (dirname) => {
  Config.load(dirname + '/app/config');
}

module.exports.config = Config;

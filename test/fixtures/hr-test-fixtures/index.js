const Path = require('path');
const Recipe = require('../../../lib/recipe');

module.exports = new Recipe(
  Path.join(__dirname, 'manifest'),
  Path.join(__dirname, 'config')
);

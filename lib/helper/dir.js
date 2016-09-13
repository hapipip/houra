'use strict';

const internals = {};
const Fs = require('fs');
const Path = require('path');

internals.dir = module.exports = {};

internals.dir.exists = (path) => {
  try {
    Fs.accessSync(path);
    return true;
  } catch(err){
    return false;
  }
};

internals.dir.relativePath = (Houra, path) => {
  if (Houra.recipeConfig.get('recipe:structure:' + path)) {
    return Houra.recipeConfig.get('recipe:structure:' + path);
  }
  throw new Error(path + ' is undefined into your structure.yml');
};

internals.dir.path = (Houra, path) => {
  return Path.join(
    Houra.root,
    internals.dir.relativePath(Houra, path)
  );
};

internals.dir.configPath = () => {
  return Path.join(__dirname, '..', 'config');
};

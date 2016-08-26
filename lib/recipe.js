'use strict';

const internals = {};
const Path = require('path');

internals.computeInit = (plugin) => {
  return 'init' +
    plugin.charAt(0).toUpperCase() +
    plugin.slice(1);
};

internals.Recipe = module.exports = class {
  constructor(Houra, path) {
    this.houra = Houra
    this.recipePath = path;
  }

  get path() {
    return this.recipePath;
  }

  get manifest() {
    return Path.join(this.path, this.houra.recipeConfig.get('recipe:manifest:path'));
  }

  get options() {
    return Path.join(this.path, this.houra.recipeConfig.get('recipe:config:path'));
  }

  initPlugin(plugin, server) {
    try {
      this[internals.computeInit(plugin)](server);
    } catch (err) {

      return;
    }
  }
};

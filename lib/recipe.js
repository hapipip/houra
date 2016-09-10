'use strict';

const Path = require('path');

const internals = {
  houra: false
};

module.exports = internals.recipe = (houra, path) => {
  internals.houra = houra;
  internals.path = path;
};

internals.recipe.initPlugin = (plugin, server) => {
  try {
    this[internals.computeInit(plugin)](server, internals.houra);
  } catch (err) {
    return;
  }
};

internals.recipe.manifest = () => {
  return Path.join(
    internals.path,
    internals.houra.recipeConfig.get('recipe:manifest:path')
  );
};

internals.recipe.options = () => {
  return Path.join(
    internals.path,
    internals.houra.recipeConfig.get('recipe:config:path')
  );
};

internals.recipe.isHouraRecipe = true;

internals.recipe.isIntialized = () => {
  return internals.houra;
};

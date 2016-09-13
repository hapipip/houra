'use strict';

const Path = require('path');

const internals = {
  houra: false,
  path: false
};

module.exports = internals.recipe = {
  isHouraRecipe: true
};

module.exports.initialize = (houra, path) => {
  internals.houra = houra;
  internals.path = path;
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

internals.recipe.isIntialized = () => {
  return internals.houra ? true : false;
};

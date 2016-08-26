'use strict';

const Glue = require('glue');
const Promise = require('bluebird');
const Recipe = require('./recipe');
const Uhu = require('uhu');
const Cocobag = require('cocobag');
const Validate = require('./schema-validator');
const Dir = require('./helper/dir');

const internals = {};

internals.Houra = module.exports = {
  root: false,
  recipeConfig: {},
  bag: {}
};

internals.Houra.path = path => {
  return Dir.path(internals.Houra, path);
};

internals.Houra.relativePath = path => {
  return Dir.relativePath(internals.Houra, path);
};

internals.load = recipe => {
  if (typeof recipe === 'string' || recipe.constructor === Recipe.constructor) {
    try {
      let AppRecipe;
      if (typeof recipe === 'string') {
        AppRecipe = require(recipe);
      } else {
        AppRecipe = recipe;
      }
      recipe = new AppRecipe(internals.Houra);
    } catch (err) {
      throw new Error('Recipe not found : ' + err.message);
    }
  }

  internals.Houra.recipeConfig = Cocobag.load({overrides: [recipe.path], defaults: [Dir.configPath()]});

  return recipe;
};

internals.Houra.initialize = Promise.method((recipe, appPath) => {
  internals.Houra.root = appPath;

  recipe = internals.load(recipe);

  let config = {
    overrides: [Dir.path(internals.Houra, 'config')],
    defaults: [recipe.options]
  };

  const bag = internals.Houra.bag = Cocobag.load(config);
  //Validate.recipe(recipe);

  const pieces = [recipe.manifest];
  if (Dir.exists(internals.Houra.path('manifest'))) {
    pieces.push(internals.Houra.path('manifest'));
  }

  const manifest = Uhu.stick(pieces, bag);
  return Glue.compose(manifest, {
    //relativeTo: __dirname+'/modules',
    preRegister: function (server, next) {
      server.register([
        require('./register/logger'),
        require('./register/config')(bag)
      ], () => {
        return next();
      });
    }
  }).then(server => {
    internals.Houra.server = server;
    return server.initialize()
      .then(() => {
        const plugins = internals.Houra.recipeConfig.get('recipe:manifest:plugins');
        if (!plugins || !plugins.length) {
          return;
        }

        plugins.forEach((plugin) => {
          recipe.initPlugin(plugin, server);
        })

      })
      .then(() => server);
  });


});

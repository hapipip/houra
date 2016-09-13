'use strict';

const Glue = require('glue');
const Promise = require('bluebird');
const Recipe = require('./recipe');
const Maite = require('maite');
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

internals.computeInit = plugin => {
  return 'init' +
  plugin.charAt(0).toUpperCase() +
  plugin.slice(1);
};

internals.Houra.path = path => {
  return Dir.path(internals.Houra, path);
};

internals.Houra.relativePath = path => {
  return Dir.relativePath(internals.Houra, path);
};

internals.load = recipe => {
  if (typeof recipe === 'string' || recipe.isHouraRecipe !== true) {
    try {
      let AppRecipe = recipe;

      if (typeof recipe === 'string') {
        AppRecipe = require(recipe);
      }

      recipe = Maite.prepare(
        {
          AppRecipe,
          Recipe
        },[
          'Recipe::manifest',
          'Recipe::options',
          'Recipe::isHouraRecipe',
          'Recipe::isIntialized'
        ]
      );
    } catch (err) {
      throw new Error('Recipe not found: ' + err.message);
    }
  }

  if (!recipe.isIntialized()) {
    Maite.cook(recipe, [internals.Houra, recipe.path], 'initialize');
  }

  internals.Houra.recipeConfig = Cocobag.load({
    overrides: [recipe.path],
    defaults: [Dir.configPath()]
  });

  if (Validate.recipeConfig(internals.Houra.recipeConfig.get('recipe')).error) {
    throw new Error('Bad recipe configuration : ' . res.error);
  }

  internals.Houra.recipe = recipe.recipe;
  return recipe;
};

internals.Houra.initialize = Promise.method((recipe, appPath) => {
  internals.Houra.root = appPath;

  recipe = internals.load(recipe);

  let config = {
    overrides: [Dir.path(internals.Houra, 'config')],
    defaults: [recipe.options()]
  };

  const bag = internals.Houra.bag = Cocobag.load(config);
  Validate.recipe(recipe);

  const pieces = [recipe.manifest()];
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
          recipe[internals.computeInit(plugin)](server, internals.Houra);
        });

        server.log('info', `Houra succesfully initialized with: ${internals.Houra.recipe.name}@${internals.Houra.recipe.version}`);
      })
      .then(() => server);
  });
});

internals.Houra.start = (recipe, appPath) => {
  internals.Houra.initialize(recipe, appPath).then(server => {
    server.log('info', 'Application started');
    server.log('info', 'Hapipip houra \\o/');
    server.start();
  });
};

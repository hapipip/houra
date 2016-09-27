'use strict';

const Glue = require('glue');
const Promise = require('bluebird');
const Recipe = require('./recipe');
const Maite = require('maite');
const Uhu = require('uhu');
const Cocobag = require('cocobag');
const Schema = require('./schema');
const Dir = require('./helper/dir');

const internals = {};

internals.capitalize = input => input.charAt(0).toUpperCase() + input.slice(1);

internals.Houra = module.exports = {
  root: false,
  recipeConfig: {},
  bag: {}
};

internals.Houra.path = path => Dir.path(internals.Houra, path);
internals.Houra.relativePath = path => Dir.relativePath(internals.Houra, path);


internals.Houra.initialize = Promise.method((recipe, appPath) => {

  internals.Houra.root = appPath;

  if (typeof recipe === 'string') {
    try {
      recipe = require(recipe);
    } catch (err) {
      throw new Error('Recipe not found: ' + err.message);
    }
  }

  if (!recipe.isHouraRecipe) {
    recipe = Maite.prepare({recipe, Recipe}, [
      'Recipe::manifest',
      'Recipe::options',
      'Recipe::isHouraRecipe',
      'Recipe::isInitialized',
      'Recipe::initialize'
    ]);
  }

  if (!recipe.isInitialized()) {
    Maite.cook(recipe, [internals.Houra, recipe.path], 'initialize');
  }

  internals.Houra.recipeConfig = Cocobag.load({
    overrides: [recipe.path],
    defaults: [Dir.configPath()]
  });


  Schema.validate('recipeConfig', internals.Houra.recipeConfig.get('recipe'), {
    message: 'Bad recipe configuration'
  });

  internals.Houra.recipe = recipe.recipe;

  let config = {
    overrides: [Dir.path(internals.Houra, 'config')],
    defaults: [recipe.options()]
  };

  const bag = internals.Houra.bag = Cocobag.load(config);

  Schema.validate('recipe', recipe);

  const pieces = [recipe.manifest()];
  if (Dir.exists(internals.Houra.path('manifest'))) {
    pieces.push(internals.Houra.path('manifest'));
  }

  const manifest = Uhu.stick(pieces, bag);

  // const relativeTo = __dirname+'/modules';
  const preRegister = (server, next) => {

    server.register([
      require('./register/logger'),
      require('./register/config')(bag)
    ], next);
  };


  return Glue.compose(manifest, {preRegister}).then(server => {

    internals.Houra.server = server;

    return server.initialize().then(() => {

      const plugins = internals.Houra.recipeConfig.get('recipe:manifest:plugins');
      if (!plugins || !plugins.length) {
        return;
      }

      plugins.forEach((plugin) => {
        recipe['init' + internals.capitalize(plugin)](server, internals.Houra);
      });

      server.log('info', `Houra succesfully initialized with: ${internals.Houra.recipe.name}@${internals.Houra.recipe.version}`);
    }).then(() => server);
  });

});

internals.Houra.start = (recipe, appPath) => {

  internals.Houra.initialize(recipe, appPath).then(server => {

    server.log('info', 'Application started');
    server.log('info', 'Hapipip houra \\o/');
    server.start();
  });
};

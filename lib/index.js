'use strict';

const Glue = require('glue');
const Hoek = require('hoek');
const Promise = require('bluebird');
const Joi = require('joi');
const Recipe = require('./recipe');
const Path = require('path');
const Uhu = require('uhu');

const internals = {};

internals.logger = {
  register: require('good'),
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ request: "*", log: "*", response: "*", error: "*"}]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
};

internals.config = {
  register: require('cocobag'),
  options: {
    defaults: []
  }
};

internals.Houra = module.exports = {};

internals.Houra.start = Promise.method((recipe, ...overrides) => {

  Joi.assert(recipe, Joi.object().type(Recipe).label('recipe').required());

  const pieces = [recipe.manifest];

  if (overrides) {
    Array.prototype.push.apply(pieces, overrides);
  }

  const manifest = Uhu.stick(pieces);

  internals.config.options.overrides = overrides;
  internals.config.options.defaults.push(recipe.options);

  return Glue.compose(manifest, {
    //relativeTo: __dirname+'/modules',
    preRegister: function (server, next) {
      server.register([
        internals.logger,
        internals.config
      ], next);
    }
  }).then(server => {
    return server.initialize()
      .then(() => {
        return recipe.preStart(server);
      })
      .then(() => server.start())
      .then(() => server);
  });


});

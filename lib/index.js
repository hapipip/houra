'use strict';

const Glue = require('glue');
const Hoek = require('hoek');
const Joi = require('joi');
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
    defaults: [Path.join(__dirname, 'config')]
  }
};

internals.recipeSchema = Joi.object({
  manifestPath: Joi.func(),
  configPath: Joi.func()
})

internals.Houra = module.exports = {};

internals.Houra.initialize = (recipe, ...paths) => {

  const result = Joi.validate(recipe, internals.recipeSchema);
  Hoek.assert(!result.error, result.error);

  paths.unshift(result.value.manifestPath());
  const manifest = Uhu.stick(paths);

  internals.config.options.paths = paths;
  internals.config.options.defaults.push(result.value.configPath());

  //manifest.server.connections.routes.files = {relativeTo: __dirname+'/static'};

  return Glue.compose(manifest, {
    //relativeTo: __dirname+'/modules',
    preRegister: function (server, next) {
      server.register(internals.logger, next);
      server.register(internals.config, next);
    }
  }).then(server => {
    return server.initialize().then(() => server)
  });

};

'use strict';

const Uhu = require('uhu');
const Path = require('path');
const Glue = require('glue');

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

internals.Houra = module.exports = {};

internals.Houra.initialize = (...paths) => {

  paths.unshift(Path.join(__dirname, 'config'));
  const manifest = Uhu.stick(paths);

  //manifest.server.connections.routes.files = {relativeTo: __dirname+'/static'};

  return Glue.compose(manifest, {
    //relativeTo: __dirname+'/modules',
    preRegister: function (server, next) {
      server.register(internals.logger, next);
    }
  }).then(server => {
    return server.initialize().then(() => server)
  });

};

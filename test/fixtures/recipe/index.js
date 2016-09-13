'use strict';

const Mustache = require('mustache');

module.exports.path = __dirname;

module.exports.initVision = (server, houra) => {
  server.views({
    engines: {
      mustache: {
        compile: function (template) {
          Mustache.parse(template);
          return function (context) {
            return Mustache.render(template, context);
          };
        }
      }
    },
    relativeTo: houra.root,
    path: houra.relativePath('template')
  });
};

module.exports.recipe = {
  name: 'houra-test-recipe',
  version: 'v1.0.0'
};

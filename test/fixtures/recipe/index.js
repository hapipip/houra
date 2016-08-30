'use strict';

const Recipe = require('./../../../lib/recipe');

const internals = {
  instance: null
};

internals.WebRecipe = module.exports = class extends Recipe {

  constructor(Houra) {
    super(Houra, __dirname);
  }

  initVision(server) {
    const Mustache = require('mustache');
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
      relativeTo: this.houra.root,
      path: this.houra.relativePath('template')
    });
  }
};

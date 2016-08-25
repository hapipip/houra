'use strict';

const Fs = require('fs');
const Recipe = require('./../../../lib/recipe');

const internals = {
  instance: null
};

internals.computeModelName = (filename) => {
  return filename.charAt(0).toUpperCase() + filename.slice(1, -3);
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

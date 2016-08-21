const internals = {};
const PellMell = require('pellmell');
const Hoek = require('hoek');
const Joi = require('joi');


internals.Recipe = module.exports = class {
  constructor(manifest, options) {

    Hoek.assert(manifest, 'No "manifest" parameter provided');

    this.options = PellMell.patch(options || {});
    this.manifest = PellMell.patch(manifest, {
      bindValue: this.options
    });
  }
  preStart() {

  }
};


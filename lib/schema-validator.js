'use strict';

const Joi = require('joi');
const Recipe = require('./recipe');

module.exports.recipe = recipe => {
  return Joi.assert(
    recipe,
    Joi.object().type(Recipe).label('recipe').required()
  );
}

'use strict';

const Joi = require('joi');
const Recipe = require('./recipe');

module.exports.recipe = recipe => {
  return Joi.assert(
    recipe,
    Joi.object().type(Recipe).label('recipe').required()
  );
};

module.exports.recipeConfig = config => {
  return Joi.validate(
    config,
    Joi.object({
      manifest: Joi.object({
        path: Joi.string(),
        plugins: Joi.array()
      }),
      config: Joi.object({
        path: Joi.string(),
        expose: Joi.array()
      }),
      structure: Joi.object()
    })
  );
};

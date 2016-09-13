'use strict';

const Joi = require('joi');

module.exports.recipe = recipe => {
  Joi.assert(
    recipe.recipe,
    Joi.object({
      name: Joi.string().regex(/^houra-.+$/),
      version: Joi.string().regex(/^v\d+\.\d+\.\d+$/)
    })
  );
  Joi.assert(
    recipe.path,
    Joi.string()
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

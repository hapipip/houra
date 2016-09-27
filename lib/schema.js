const Joi = require('joi');
const Hoek = require('hoek');

const internals = {};

exports.validate = (type, input, {message, assert = true} = {}) => {

  const result = Joi.validate(input, internals[type]);

  if (assert)
    Hoek.assert(!result.error, 'Invalid', type, 'options', message ? '(' + message + ')' : '', result.error && result.error.annotate());

  return result.value;
};

internals.recipeConfig = Joi.object({
  manifest: Joi.object({
    path: Joi.string(),
    plugins: Joi.array()
  }),
  config: Joi.object({
    path: Joi.string(),
    expose: Joi.array()
  }),
  structure: Joi.object()
});

internals.recipe = Joi.object({
  isHouraRecipe: Joi.any().valid(true).required(),
  manifest: Joi.func().required(),
  options: Joi.func().required(),
  initialize: Joi.func().required(),
  isInitialized: Joi.func().required(),
  recipe: Joi.object({
    name: Joi.string().regex(/^houra-.+$/),
    version: Joi.string().regex(/^v\d+\.\d+\.\d+$/)
  }),
  path: Joi.string().required()
}).required().unknown(true);
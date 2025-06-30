const Joi = require('joi');

const foodSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  brand: Joi.string().allow('', null),
  serving_size: Joi.number().min(0).required(),
  calories_per_serving: Joi.number().min(0).required(),
  protein_per_serving: Joi.number().min(0).allow(null),
  carbs_per_serving: Joi.number().min(0).allow(null),
  fat_per_serving: Joi.number().min(0).allow(null),
  category: Joi.string().allow('', null)
});

const validateFood = (data) => foodSchema.validate(data);

module.exports = { validateFood }; 
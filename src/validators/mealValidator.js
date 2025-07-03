const Joi = require('joi');

const mealSchema = Joi.object({
  meal_type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
  meal_name: Joi.string().min(2).max(100).required(),
  meal_quantity: Joi.number().min(0).required(),
  meal_serving_size: Joi.string().min(1).required().allow('kg', 'g', 'ml', 'l'),
  notes: Joi.string().allow('', null)
});

const validateMeal = (data) => mealSchema.validate(data);

module.exports = { validateMeal }; 
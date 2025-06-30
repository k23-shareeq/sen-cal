const Joi = require('joi');

const mealSchema = Joi.object({
  meal_type_id: Joi.string().uuid().required(),
  meal_date: Joi.string().isoDate().required(),
  name: Joi.string().min(2).max(100).required(),
  notes: Joi.string().allow('', null),
  total_calories: Joi.number().min(0).allow(null),
  total_protein: Joi.number().min(0).allow(null),
  total_carbs: Joi.number().min(0).allow(null),
  total_fat: Joi.number().min(0).allow(null)
});

const validateMeal = (data) => mealSchema.validate(data);

module.exports = { validateMeal }; 
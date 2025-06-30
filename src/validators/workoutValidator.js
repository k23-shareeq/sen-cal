const Joi = require('joi');

const workoutSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  workout_date: Joi.string().isoDate().required(),
  duration_minutes: Joi.number().min(0).allow(null),
  total_calories_burned: Joi.number().min(0).allow(null),
  notes: Joi.string().allow('', null)
});

const validateWorkout = (data) => workoutSchema.validate(data);

module.exports = { validateWorkout }; 
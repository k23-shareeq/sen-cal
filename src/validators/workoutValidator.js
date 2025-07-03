const Joi = require("joi");

const workoutSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  workout_type: Joi.string()
    .isoDate()
    .required()
    .allow(
      "cycling",
      "swimming",
      "walking",
      "yoga",
      "strength_training",
      "stretching",
      "other"
    ),
  duration_minutes: Joi.number().min(0).allow(null),
  intensity: Joi.number().min(0).allow(1, 2, 3),
  notes: Joi.string().allow("", null),
});

const validateWorkout = (data) => workoutSchema.validate(data);

module.exports = { validateWorkout };

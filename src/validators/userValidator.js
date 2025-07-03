const Joi = require('joi');

const userProfileSchema = Joi.object({
  age: Joi.number().integer().min(0).max(120).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  height_cm: Joi.number().min(50).max(300).required(),
  curr_weight_kg: Joi.number().min(20).max(500).required(),
  target_weight_kg: Joi.number().min(20).max(500).required(),
});

exports.createUserProfileValidator = (req, res, next) => {
  const { error } = userProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  next();
};

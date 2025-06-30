const express = require('express');
const mealController = require('../controllers/mealController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal tracking and management
 */

router.get('/', authenticateToken, mealController.getMeals);
router.post('/', authenticateToken, mealController.createMeal);
router.get('/:id', authenticateToken, mealController.getMealById);
router.put('/:id', authenticateToken, mealController.updateMeal);
router.delete('/:id', authenticateToken, mealController.deleteMeal);

module.exports = router; 
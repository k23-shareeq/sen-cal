const express = require('express');
const workoutController = require('../controllers/workoutController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout logging and management
 */

router.get('/', authenticateToken, workoutController.getWorkouts);
router.post('/', authenticateToken, workoutController.createWorkout);
router.get('/:id', authenticateToken, workoutController.getWorkoutById);
router.put('/:id', authenticateToken, workoutController.updateWorkout);
router.delete('/:id', authenticateToken, workoutController.deleteWorkout);

module.exports = router; 
const workoutService = require('../services/workoutService');
const { validateWorkout } = require('../validators/workoutValidator');

class WorkoutController {
  /**
   * @swagger
   * /api/workouts:
   *   get:
   *     summary: Get user workouts for a specific date
   *     tags: [Workouts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: Date to filter workouts (YYYY-MM-DD format)
   *     responses:
   *       200:
   *         description: Workouts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 workouts:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Workout'
   */
  async getWorkouts(req, res) {
    const user_id = req.user.id;
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }
    const workouts = await workoutService.getWorkoutsByUserAndDate(user_id, date);
    res.json({ workouts });
  }

  /**
   * @swagger
   * /api/workouts:
   *   post:
   *     summary: Create a new workout
   *     tags: [Workouts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Workout'
   *     responses:
   *       201:
   *         description: Workout created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 workout:
   *                   $ref: '#/components/schemas/Workout'
   */
  async createWorkout(req, res) {
    const { error } = validateWorkout(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const workout = await workoutService.createWorkout({ ...req.body, user_id: req.user.id });
    res.status(201).json({ message: 'Workout created successfully', workout });
  }

  /**
   * @swagger
   * /api/workouts/{id}:
   *   get:
   *     summary: Get a workout by ID
   *     tags: [Workouts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Workout retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 workout:
   *                   $ref: '#/components/schemas/Workout'
   *       404:
   *         description: Workout not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getWorkoutById(req, res) {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout || workout.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ workout });
  }

  /**
   * @swagger
   * /api/workouts/{id}:
   *   put:
   *     summary: Update a workout
   *     tags: [Workouts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Workout'
   *     responses:
   *       200:
   *         description: Workout updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 workout:
   *                   $ref: '#/components/schemas/Workout'
   *       404:
   *         description: Workout not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async updateWorkout(req, res) {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout || workout.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    const { error } = validateWorkout(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updated = await workoutService.updateWorkout(req.params.id, req.body);
    res.json({ message: 'Workout updated successfully', workout: updated });
  }

  /**
   * @swagger
   * /api/workouts/{id}:
   *   delete:
   *     summary: Delete a workout
   *     tags: [Workouts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Workout deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Workout not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async deleteWorkout(req, res) {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout || workout.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    await workoutService.deleteWorkout(req.params.id);
    res.json({ message: 'Workout deleted successfully' });
  }
}

module.exports = new WorkoutController(); 
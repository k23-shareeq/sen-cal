const mealService = require('../services/mealService');
const { validateMeal } = require('../validators/mealValidator');

class MealController {
  /**
   * @swagger
   * /api/meals:
   *   get:
   *     summary: Get user meals for a specific date
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: Date to filter meals (YYYY-MM-DD format)
   *     responses:
   *       200:
   *         description: Meals retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 meals:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Meal'
   */
  async getMeals(req, res) {
    const user_id = req.user.id;
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }
    const meals = await mealService.getMealsByUserAndDate(user_id, date);
    res.json({ meals });
  }

  /**
   * @swagger
   * /api/meals:
   *   post:
   *     summary: Create a new meal
   *     tags: [Meals]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [meal_type_id, meal_date, name]
   *             properties:
   *               meal_type_id:
   *                 type: string
   *                 format: uuid
   *               meal_date:
   *                 type: string
   *                 format: date
   *               name:
   *                 type: string
   *               notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Meal created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 meal:
   *                   $ref: '#/components/schemas/Meal'
   */
  async createMeal(req, res) {
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const meal = await mealService.createMeal({ ...req.body, user_id: req.user.id });
    res.status(201).json({ message: 'Meal created successfully', meal });
  }

  /**
   * @swagger
   * /api/meals/{id}:
   *   get:
   *     summary: Get a meal by ID
   *     tags: [Meals]
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
   *         description: Meal retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 meal:
   *                   $ref: '#/components/schemas/Meal'
   *       404:
   *         description: Meal not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getMealById(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json({ meal });
  }

  /**
   * @swagger
   * /api/meals/{id}:
   *   put:
   *     summary: Update a meal
   *     tags: [Meals]
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
   *             $ref: '#/components/schemas/Meal'
   *     responses:
   *       200:
   *         description: Meal updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 meal:
   *                   $ref: '#/components/schemas/Meal'
   *       404:
   *         description: Meal not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async updateMeal(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    const { error } = validateMeal(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updated = await mealService.updateMeal(req.params.id, req.body);
    res.json({ message: 'Meal updated successfully', meal: updated });
  }

  /**
   * @swagger
   * /api/meals/{id}:
   *   delete:
   *     summary: Delete a meal
   *     tags: [Meals]
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
   *         description: Meal deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Meal not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async deleteMeal(req, res) {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal || meal.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    await mealService.deleteMeal(req.params.id);
    res.json({ message: 'Meal deleted successfully' });
  }
}

module.exports = new MealController(); 
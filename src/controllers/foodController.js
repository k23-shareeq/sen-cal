const foodService = require('../services/foodService');
const { validateFood } = require('../validators/foodValidator');

class FoodController {
  /**
   * @swagger
   * /api/foods/search:
   *   get:
   *     summary: Search foods by name or brand
   *     tags: [Foods]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         required: true
   *         description: Search query
   *     responses:
   *       200:
   *         description: Foods found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 foods:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Food'
   */
  async searchFoods(req, res) {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const foods = await foodService.searchFoods(q);
    res.json({ foods });
  }

  /**
   * @swagger
   * /api/foods:
   *   post:
   *     summary: Create a new food item
   *     tags: [Foods]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Food'
   *     responses:
   *       201:
   *         description: Food created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 food:
   *                   $ref: '#/components/schemas/Food'
   */
  async createFood(req, res) {
    const { error } = validateFood(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const food = await foodService.createFood(req.body);
    res.status(201).json({ message: 'Food created successfully', food });
  }

  async getAllFoods(req, res){
    const allFoods = await foodService.getAllFoods();
    res.json({ foods: allFoods });
  }
}

module.exports = new FoodController(); 
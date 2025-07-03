const express = require('express');
const foodController = require('../controllers/foodController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food database and search
 */

router.get("/", authenticateToken, foodController.getAllFoods);
router.get('/search', authenticateToken, foodController.searchFoods);
router.post('/', authenticateToken, foodController.createFood);

module.exports = router; 
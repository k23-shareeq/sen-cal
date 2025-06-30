const pool = require('../database/connection');

class FoodService {
  async searchFoods(query) {
    const sql = `SELECT * FROM foods WHERE LOWER(name) LIKE $1 OR LOWER(brand) LIKE $1 ORDER BY name LIMIT 20`;
    const result = await pool.query(sql, [`%${query.toLowerCase()}%`]);
    return result.rows;
  }

  async createFood(food) {
    const sql = `
      INSERT INTO foods (name, brand, serving_size, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      food.name,
      food.brand,
      food.serving_size,
      food.calories_per_serving,
      food.protein_per_serving,
      food.carbs_per_serving,
      food.fat_per_serving,
      food.category
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  }
}

module.exports = new FoodService(); 
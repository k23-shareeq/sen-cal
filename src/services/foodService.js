const pool = require('../database/connection');

class FoodService {
  async searchFoods(query) {
    const sql = `SELECT * FROM foods WHERE LOWER(name) LIKE $1 OR LOWER(brand) LIKE $1 ORDER BY name LIMIT 20`;
    const result = await pool.query(sql, [`%${query.toLowerCase()}%`]);
    return result.rows;
  }

  async createFood(food) {
    console.log("Creating Food: ", food);
    const sql = `
      INSERT INTO foods (name,serving_unit, serving_size, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving,fiber_per_serving,sugar_per_serving, category,  confidence_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      food.name,
      food.serving_unit,
      food.serving_size,
      food.calories_per_serving,
      food.protein_per_serving,
      food.carbs_per_serving,
      food.fat_per_serving,
      food.fiber_per_serving,
      food.sugar_per_serving,
      food.category,
      food.confidence_level * 100
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async getAllFoods(){
    const sql = `SELECT * FROM foods ORDER BY name`;
    const result = await pool.query(sql);
    return result.rows;
  }
}

module.exports = new FoodService(); 
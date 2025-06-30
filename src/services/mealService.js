const pool = require('../database/connection');

class MealService {
  async createMeal(meal) {
    const query = `
      INSERT INTO meals (user_id, meal_type_id, meal_date, name, notes, total_calories, total_protein, total_carbs, total_fat)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      meal.user_id,
      meal.meal_type_id,
      meal.meal_date,
      meal.name,
      meal.notes,
      meal.total_calories,
      meal.total_protein,
      meal.total_carbs,
      meal.total_fat
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getMealsByUserAndDate(user_id, date) {
    const query = `
      SELECT * FROM meals
      WHERE user_id = $1 AND meal_date = $2
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id, date]);
    return result.rows;
  }

  async getMealById(id) {
    const query = 'SELECT * FROM meals WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async updateMeal(id, meal) {
    const query = `
      UPDATE meals SET
        meal_type_id = $1,
        meal_date = $2,
        name = $3,
        notes = $4,
        total_calories = $5,
        total_protein = $6,
        total_carbs = $7,
        total_fat = $8
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      meal.meal_type_id,
      meal.meal_date,
      meal.name,
      meal.notes,
      meal.total_calories,
      meal.total_protein,
      meal.total_carbs,
      meal.total_fat,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteMeal(id) {
    const query = 'DELETE FROM meals WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new MealService(); 
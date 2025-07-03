const pool = require('../database/connection');
const { generateResponse } = require('../llm/llmService');

class MealService {

  async generateMeal(meal) {
    const response = await generateResponse(meal);
    return response;
  }
  
  async createMeal(meal) {
    console.log("Creating Meal: ", meal)
    const query = `
      INSERT INTO meals (user_id, meal_type, name, total_calories, total_protein, total_carbs, total_fat, total_fiber, total_sugar, confidence_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      meal.user_id,
      meal.meal_type,
      meal.name,
      meal.total_calories,
      meal.total_protein,
      meal.total_carbs,
      meal.total_fat,
      meal.total_fiber,
      meal.total_sugar,
      meal.confidence_level
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

  async getMealsForToday(userId) {
    // Get today's date in UTC+5 (Asia/Karachi)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const query = `
      SELECT * FROM meals
      WHERE user_id = $1
        AND TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi', 'YYYY-MM-DD') = $2
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId, todayStr]);
    return result.rows;
  }

  async getMealSummaryForUserToday(userId) {
    const sql = `
      SELECT 
        SUM(total_calories) AS total_calories,
        SUM(total_protein) AS total_protein,
        SUM(total_carbs) AS total_carbs,
        SUM(total_fat) AS total_fat,
        SUM(total_fiber) AS total_fiber,
        SUM(total_sugar) AS total_sugar
      FROM meals
      WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE
    `;
    const result = await pool.query(sql, [userId]);
    return result.rows[0];
  }
}

module.exports = new MealService(); 
const pool = require('../database/connection');

class WorkoutService {
  async createWorkout(workout) {
    const query = `
      INSERT INTO workouts (user_id, name, workout_date, duration_minutes, total_calories_burned, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      workout.user_id,
      workout.name,
      workout.workout_date,
      workout.duration_minutes,
      workout.total_calories_burned,
      workout.notes
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getWorkoutsByUserAndDate(user_id, date) {
    const query = `
      SELECT * FROM workouts
      WHERE user_id = $1 AND workout_date = $2
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id, date]);
    return result.rows;
  }

  async getWorkoutById(id) {
    const query = 'SELECT * FROM workouts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async updateWorkout(id, workout) {
    const query = `
      UPDATE workouts SET
        name = $1,
        workout_date = $2,
        duration_minutes = $3,
        total_calories_burned = $4,
        notes = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      workout.name,
      workout.workout_date,
      workout.duration_minutes,
      workout.total_calories_burned,
      workout.notes,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteWorkout(id) {
    const query = 'DELETE FROM workouts WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new WorkoutService(); 
const pool = require('../database/connection');

class UserService {
  async createUser(userData) {
    const query = `
      INSERT INTO users (email, password_hash, name, daily_goal)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, daily_goal, created_at
    `;
    const values = [userData.email, userData.passwordHash, userData.name, userData.daily_goal];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async findUserById(id) {
    const query = `
      SELECT u.*, up.* 
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findUserGoal(id){
    const query = `
    SELECT u.daily_goal
    FROM users u
    WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0].daily_goal;
  }
}

module.exports = new UserService(); 
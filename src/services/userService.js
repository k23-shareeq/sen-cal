const pool = require("../database/connection");

class UserService {
  async createUser(userData) {
    const query = `
      INSERT INTO users (email, password_hash, name, daily_goal)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, daily_goal, created_at
    `;
    const values = [
      userData.email,
      userData.passwordHash,
      userData.name,
      userData.daily_goal,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async createUserProfile(user) {
    console.log("Creating user profile with data:", user);
    // create user profile
    // user : {user_id, age, gender, height_cm, curr_weight_kg, target_weight_kg}
    const query = `
    INSERT INTO user_profiles (user_id, age, gender, height_cm, curr_weight_kg, target_weight_kg)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, age, gender, height_cm, curr_weight_kg, target_weight_kg
    `;
    const values = [
      user.user_id,
      user.age,
      user.gender,
      user.height_cm,
      user.curr_weight_kg,
      user.target_weight_kg,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findUserById(id) {
    const query = `
    SELECT u.id, u.email, u.name, u.daily_goal, u.created_at
    FROM users u
    WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async getUserProfileDetails(id) {
    const query = `
    SELECT up.*
    FROM user_profiles up
    WHERE up.user_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findUserGoal(id) {
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

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('./userService');

class AuthService {
  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  async register(userData) {
    const hashedPassword = await this.hashPassword(userData.password);
    return await userService.createUser({
      ...userData,
      passwordHash: hashedPassword
    });
  }

  async login(email, password) {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await this.comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }
}

module.exports = new AuthService(); 
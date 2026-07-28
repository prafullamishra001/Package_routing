const { userModel } = require('../models/post.model');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const alerting = require('../utils/alerting');

async function registerUser(req, res) {
  const { username, email, password, role } = req.body;

  try {
    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      logger.warn('Registration failed: User already exists', { email });
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await userModel.create({ username, email, password, role });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    logger.info('User registered successfully', { userId: user._id, email });
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      logger.warn('Login failed: User not found', { email, ip });
      alerting.alertAuthenticationFailure(ip, 1);
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    if (user.password !== password) {
      logger.warn('Login failed: Invalid password', { email, ip });
      alerting.alertAuthenticationFailure(ip, 1);
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    logger.info('User logged in successfully', { userId: user._id, email });
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
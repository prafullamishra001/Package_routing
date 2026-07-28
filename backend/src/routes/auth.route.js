const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.registerUser);
router.post('/login', validate(loginSchema), authController.loginUser);

module.exports = router;
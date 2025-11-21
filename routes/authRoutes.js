const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas (requieren JWT)
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;

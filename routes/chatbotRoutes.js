const express = require('express');
const router = express.Router();
const { sendMessage, listModels } = require('../controllers/chatbotController');

// Rutas públicas del chatbot (no requieren autenticación)
router.post('/message', sendMessage);
router.get('/models', listModels);

module.exports = router;

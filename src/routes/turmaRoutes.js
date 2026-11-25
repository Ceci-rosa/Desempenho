
const express = require('express');
const router = express.Router();

const TurmaController = require('../controllers/turmaController');

// Listar turmas
router.get('/turmas', TurmaController.listar);

module.exports = router;

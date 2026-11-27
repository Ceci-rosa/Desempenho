
const express = require('express');
const router = express.Router();

const AvaliacaoController = require('../controllers/avaliacaoController');

// Cadastrar uma avaliação
router.post('/avaliacoes', AvaliacaoController.cadastrar);

// Listar avaliações
router.get('/avaliacoes', AvaliacaoController.listar);

module.exports = router;

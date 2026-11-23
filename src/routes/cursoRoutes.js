const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/cursoController');

// Rota para listar cursos (GET /api/cursos)
router.get('/cursos', CursoController.listar);

// Rota para criar um curso (POST /api/cursos)
router.post('/cursos', CursoController.criar);

module.exports = router;
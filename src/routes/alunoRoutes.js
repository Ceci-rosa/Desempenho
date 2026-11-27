const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

// Listar alunos
router.get('/alunos', AlunoController.listar);

// Cadastrar aluno
router.post('/alunos', AlunoController.cadastrar);


module.exports = router;
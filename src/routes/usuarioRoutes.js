const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.post('/usuarios', UsuarioController.cadastrar);
router.post('/login', UsuarioController.login);

module.exports = router;

module.exports = router;
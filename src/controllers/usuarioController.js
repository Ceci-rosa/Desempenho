const { Usuario } = require('../models');

class UsuarioController {
  static async cadastrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
      }

      // Verificar se o e-mail já existe
      const usuarioExiste = await Usuario.findOne({ where: { email } });
      if (usuarioExiste) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Criar usuário (Nota: em produção, lembre-se de usar bcrypt para criptografar a senha)
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha, // senha em texto plano apenas para teste inicial
        tipo: 'USER',
        status: 'ATIVO'
      });

      return res.status(201).json({ 
        message: 'Professor cadastrado com sucesso!', 
        usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email } 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário', details: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Informe e-mail e senha.' });
      }

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      if (usuario.status !== 'ATIVO') {
        return res.status(403).json({ error: 'Usuário inativo.' });
      }

      return res.json({
        message: 'Login realizado com sucesso!',
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
    }
  }
};





module.exports = UsuarioController;
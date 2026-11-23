const Curso = require('../models/cursoModel');

class CursoController {
  // 1. Listar todos os cursos
  static async listar(req, res) {
    try {
      const cursos = await Curso.findAll();
      return res.status(200).json(cursos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar cursos', details: error.message });
    }
  }

  // 2. Criar um novo curso
  static async criar(req, res) {
    try {
      const { usuario_id, nome, descricao } = req.body;

      if (!usuario_id || !nome) {
        return res.status(400).json({ error: 'usuario_id e nome são obrigatórios' });
      }

      const novoCurso = await Curso.create({ usuario_id, nome, descricao });
      return res.status(201).json(novoCurso);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar curso', details: error.message });
    }
  }
}

module.exports = CursoController;
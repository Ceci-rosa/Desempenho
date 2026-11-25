const { Aluno, Turma } = require('../models');

class AlunoController {
  static async cadastrar(req, res) {
    try {
      const { usuario_id, turma_id, nome, codigo_aluno, email, telefone, data_nascimento } = req.body;

      if (!usuario_id || !turma_id || !nome || !codigo_aluno) {
        return res.status(400).json({ error: 'Preencha turma, nome e código do aluno.' });
      }

      // A turma precisa existir e ser do professor logado
      const turma = await Turma.findOne({ where: { id: turma_id, usuario_id } });
      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada para este professor.' });
      }

      // Código do aluno único dentro da turma
      const codigoExiste = await Aluno.findOne({ where: { turma_id, codigo_aluno } });
      if (codigoExiste) {
        return res.status(400).json({ error: 'Já existe um aluno com este código nesta turma.' });
      }

      const novoAluno = await Aluno.create({
        turma_id,
        nome: nome.trim(),
        codigo_aluno: codigo_aluno.trim(),
        email: email || null,
        telefone: telefone || null,
        data_nascimento: data_nascimento || null,
      });

      return res.status(201).json({
        message: 'Aluno cadastrado com sucesso!',
        aluno: { id: novoAluno.id, nome: novoAluno.nome, codigo_aluno: novoAluno.codigo_aluno }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar aluno', details: error.message });
    }
  }
}

module.exports = AlunoController;
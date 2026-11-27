const { Aluno, Turma, Curso } = require('../models');

class AlunoController {
  static async listar(req, res) {
    try {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({
                error: 'O ID do usuário é obrigatório.'
            });
        }

        const alunos = await Aluno.findAll({
            include: [{
                model: Turma,
                as: 'turma',
                where: {
                    usuario_id: usuario_id
                },
                attributes: ['id', 'nome', 'curso_id'],
                include: [{
                    model: Curso,
                    as: 'curso',
                    attributes: ['id', 'nome']
                }]
            }],
            order: [['nome', 'ASC']]
        });

        return res.status(200).json(alunos);

    } catch (error) {
        console.error('Erro ao listar alunos:', error);

        return res.status(500).json({
            error: 'Erro ao buscar alunos.'
        });
    }
}
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

    static async listar(req, res) {
    try {
      const { usuario_id, turma_id } = req.query;

      if (!usuario_id || !turma_id) {
        return res.status(400).json({ error: 'Informe usuario_id e turma_id.' });
      }

      // A turma precisa ser do professor logado
      const turma = await Turma.findOne({ where: { id: turma_id, usuario_id } });
      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada para este professor.' });
      }

      const alunos = await Aluno.findAll({
        where: { turma_id, status: 'ATIVO' },
        attributes: ['id', 'nome', 'codigo_aluno'],
        order: [['nome', 'ASC']],
      });

      return res.json(alunos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar alunos', details: error.message });
    }
  }
}

module.exports = AlunoController;
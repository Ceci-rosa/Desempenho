
const { Turma } = require('../models');

class TurmaController {

  static async listar(req, res) {
    try {
      const { usuario_id } = req.query;

      if (!usuario_id) {
        return res.status(400).json({
          error: 'O ID do usuário é obrigatório.'
        });
      }

      const turmas = await Turma.findAll({
        where: {
          usuario_id: usuario_id,
          status: 'ATIVA'
        },
        attributes: ['id', 'nome', 'curso_id'],
        order: [['nome', 'ASC']]
      });

      return res.status(200).json(turmas);

    } catch (error) {
      console.error('Erro ao listar turmas:', error);

      return res.status(500).json({
        error: 'Erro ao buscar turmas.'
      });
    }
  }

}

module.exports = TurmaController;

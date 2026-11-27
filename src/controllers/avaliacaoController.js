
const {
  Avaliacao,
  Turma,
  AvaliacaoCriterio,
  CriterioAvaliacao
} = require('../models');

const AvaliacaoController = {

  // Cadastrar uma avaliação
  async cadastrar(req, res) {
    try {
      const {
        usuario_id,
        turma_id,
        titulo,
        data_avaliacao,
        observacao
      } = req.body;

      if (!usuario_id || !turma_id || !titulo || !data_avaliacao) {
        return res.status(400).json({
          mensagem: 'Preencha todos os campos obrigatórios.'
        });
      }

      const turma = await Turma.findOne({
        where: {
          id: turma_id,
          usuario_id
        }
      });

      if (!turma) {
        return res.status(404).json({
          mensagem: 'Turma não encontrada para este usuário.'
        });
      }

      const avaliacao = await Avaliacao.create({
        usuario_id,
        turma_id,
        titulo,
        data_avaliacao,
        observacao
      });

      return res.status(201).json({
        mensagem: 'Avaliação cadastrada com sucesso!',
        avaliacao
      });

    } catch (erro) {
      console.error('Erro ao cadastrar avaliação:', erro);

      return res.status(500).json({
        mensagem: 'Erro ao cadastrar avaliação.',
        erro: erro.message
      });
    }
  },

  // Listar avaliações
  async listar(req, res) {
    try {
      const { usuario_id } = req.query;

      if (!usuario_id) {
        return res.status(400).json({
          mensagem: 'Informe o usuário.'
        });
      }

      const avaliacoes = await Avaliacao.findAll({
        where: {
          usuario_id
        },
        include: [
          {
            model: Turma,
            as: 'turma',
            attributes: ['id', 'nome']
          }
        ],
        order: [['id', 'DESC']]
      });

      return res.status(200).json(avaliacoes);

    } catch (erro) {
      console.error('Erro ao listar avaliações:', erro);

      return res.status(500).json({
        mensagem: 'Erro ao listar avaliações.',
        erro: erro.message
      });
    }
  }

};

module.exports = AvaliacaoController;

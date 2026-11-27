
document.addEventListener('DOMContentLoaded', async () => {
    const selectTurma = document.getElementById('turma_id');
    const formulario = document.querySelector('.cadastro-form');

    // Recupera os dados do usuário logado
    let usuario = null;

    try {
        usuario = JSON.parse(localStorage.getItem('usuario'));
    } catch (erro) {
        console.error('Erro ao recuperar usuário:', erro);
    }

    // Verifica se existe um usuário identificado
    if (!usuario || !usuario.id) {
        selectTurma.innerHTML =
            '<option value="">Usuário não identificado</option>';
        return;
    }

    // 1. CARREGAR AS TURMAS
    try {
        const resposta = await fetch(
            `/api/turmas?usuario_id=${encodeURIComponent(usuario.id)}`
        );

        if (!resposta.ok) {
            throw new Error('Erro ao buscar turmas.');
        }

        const turmas = await resposta.json();

        selectTurma.innerHTML =
            '<option value="" selected disabled>Selecione uma turma</option>';

        if (turmas.length === 0) {
            selectTurma.innerHTML =
                '<option value="">Nenhuma turma ativa encontrada</option>';
        } else {
            turmas.forEach(turma => {
                const option = document.createElement('option');

                option.value = turma.id;
                option.textContent = turma.nome;

                selectTurma.appendChild(option);
            });
        }

    } catch (erro) {
        console.error('Erro ao carregar turmas:', erro);

        selectTurma.innerHTML =
            '<option value="">Erro ao carregar turmas</option>';
    }

    // 2. CADASTRAR O ALUNO
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const dados = {
            usuario_id: usuario.id,
            turma_id: selectTurma.value,
            nome: formulario.elements['nome'].value.trim(),
            codigo_aluno: formulario.elements['codigo'].value.trim(),
            email: formulario.elements['email'].value.trim(),
            telefone: formulario.elements['telefone'].value.trim(),
            data_nascimento: formulario.elements['nascimento'].value
        };

        if (!dados.turma_id || !dados.nome || !dados.codigo_aluno) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const resposta = await fetch('/api/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error || 'Erro ao cadastrar aluno.'
                );
            }

            alert('Aluno cadastrado com sucesso!');
            window.location.href = 'aluno.html';

        } catch (erro) {
            console.error('Erro ao cadastrar aluno:', erro);
            alert(erro.message);
        }
    });
});


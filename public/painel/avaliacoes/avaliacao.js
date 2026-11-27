const API_URL = 'http://localhost:3000/api';

const selectAluno = document.getElementById('selectAluno');
const selectTurma = document.getElementById('selectTurma').innerHTML;
console.log('Turmas recebidas:', turmas);
console.log('Elemento select:', selectTurma);


// Carregar turmas
async function carregarTurmas() {
    try {
        const resposta = await fetch(`${API_URL}/turmas?usuario_id=1`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar turmas.');
        }

        const turmas = await resposta.json();

        selectTurma.innerHTML =
            '<option value="">Selecione uma turma</option>';

        turmas.forEach(turma => {
            const option = document.createElement('option');

            option.value = turma.id;
            option.textContent = turma.nome;

            selectTurma.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar turmas:', erro);
    }
}

carregarTurmas();

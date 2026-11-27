

// Elementos da página
const tbody = document.getElementById('studentRows');
const campoPesquisa = document.getElementById('searchInput');
const filtroCurso = document.getElementById('courseFilter');
const contador = document.getElementById('countLabel');
const paginacao = document.getElementById('pagination');

// Recupera o usuário que fez login
function obterUsuario() {
    try {
        return JSON.parse(localStorage.getItem('usuario'));
    } catch (erro) {
        console.error('Erro ao recuperar usuário:', erro);
        return null;
    }
}

// Carrega os alunos da API
async function carregarAlunos() {
    if (!tbody) {
        console.error('Elemento studentRows não encontrado.');
        return;
    }

    const usuario = obterUsuario();

    if (!usuario || !usuario.id) {
        mostrarMensagem('Usuário não identificado.');
        return;
    }

    try {
        const resposta = await fetch(
            `/api/alunos?usuario_id=${encodeURIComponent(usuario.id)}`
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        todosAlunos = await resposta.json();

        // Prepara o filtro de cursos
        carregarFiltroCursos();

        // Exibe todos os alunos inicialmente
        aplicarFiltros();

    } catch (erro) {
        console.error('Erro ao carregar alunos:', erro);
        mostrarMensagem('Não foi possível carregar os alunos.');
    }
}

// Preenche o filtro com os cursos encontrados
function carregarFiltroCursos() {
    filtroCurso.innerHTML = '<option value="">Todos os cursos</option>';

    const cursos = [
        ...new Set(
            todosAlunos
                .map(aluno => aluno.turma?.curso?.nome)
                .filter(Boolean)
        )
    ];

    cursos.sort((a, b) => a.localeCompare(b));

    cursos.forEach(nomeCurso => {
        const opcao = document.createElement('option');
        opcao.value = nomeCurso;
        opcao.textContent = nomeCurso;

        filtroCurso.appendChild(opcao);
    });
}

// Pesquisa e filtra os alunos
function aplicarFiltros() {
    const pesquisa = campoPesquisa.value.trim().toLowerCase();
    const cursoSelecionado = filtroCurso.value.toLowerCase();

    alunosFiltrados = todosAlunos.filter(aluno => {
        const nome = (aluno.nome || '').toLowerCase();
        const codigo = (aluno.codigo_aluno || '').toLowerCase();
        const email = (aluno.email || '').toLowerCase();
        const curso = (aluno.turma?.curso?.nome || '').toLowerCase();

        const correspondePesquisa =
            nome.includes(pesquisa) ||
            codigo.includes(pesquisa) ||
            email.includes(pesquisa);

        const correspondeCurso =
            !cursoSelecionado || curso === cursoSelecionado;

        return correspondePesquisa && correspondeCurso;
    });

    paginaAtual = 1;
    renderizarAlunos();
}

// Cria uma linha da tabela
function criarLinhaAluno(aluno) {
    const linha = document.createElement('tr');

    const dados = [
        aluno.nome || '-',
        aluno.email || '-',
        aluno.telefone || '-',
        aluno.turma?.curso?.nome || '-',
        aluno.turma?.nome || '-'
    ];

    dados.forEach(valor => {
        const celula = document.createElement('td');
        celula.textContent = valor;
        linha.appendChild(celula);
    });

    // Status
    const celulaStatus = document.createElement('td');
    const status = document.createElement('span');

    const ativo = aluno.status === 'ATIVO';

    status.className = ativo ? 'status active' : 'status inactive';
    status.textContent = ativo ? 'Ativo' : 'Inativo';

    celulaStatus.appendChild(status);
    linha.appendChild(celulaStatus);

    // Ações ainda não conectadas ao backend
    const celulaAcoes = document.createElement('td');
    celulaAcoes.textContent = '—';
    linha.appendChild(celulaAcoes);

    return linha;
}

// Exibe os alunos na tabela
function renderizarAlunos() {
    tbody.innerHTML = '';

    if (alunosFiltrados.length === 0) {
        mostrarMensagem(
            todosAlunos.length === 0
                ? 'Nenhum aluno cadastrado.'
                : 'Nenhum aluno encontrado.'
        );

        atualizarContador();
        atualizarPaginacao();
        return;
    }

    const inicio = (paginaAtual - 1) * alunosPorPagina;
    const fim = inicio + alunosPorPagina;

    const alunosDaPagina = alunosFiltrados.slice(inicio, fim);

    alunosDaPagina.forEach(aluno => {
        tbody.appendChild(criarLinhaAluno(aluno));
    });

    atualizarContador();
    atualizarPaginacao();
}

// Mensagens dentro da tabela
function mostrarMensagem(mensagem) {
    tbody.innerHTML = '';

    const linha = document.createElement('tr');
    const celula = document.createElement('td');

    celula.colSpan = 7;
    celula.textContent = mensagem;

    linha.appendChild(celula);
    tbody.appendChild(linha);
}

// Atualiza a quantidade de alunos
function atualizarContador() {
    const total = alunosFiltrados.length;

    const inicio = total === 0
        ? 0
        : (paginaAtual - 1) * alunosPorPagina + 1;

    const fim = Math.min(
        paginaAtual * alunosPorPagina,
        total
    );

    contador.textContent = `Mostrando ${inicio}–${fim} de ${total} alunos`;
}

// Cria os botões de paginação
function atualizarPaginacao() {
    paginacao.innerHTML = '';

    const totalPaginas = Math.ceil(
        alunosFiltrados.length / alunosPorPagina
    );

    if (totalPaginas <= 1) return;

    criarBotaoPagina('‹', paginaAtual - 1, paginaAtual === 1);

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        const botao = criarBotaoPagina(
            pagina,
            pagina,
            false
        );

        if (pagina === paginaAtual) {
            botao.classList.add('selected');
        }
    }

    criarBotaoPagina(
        '›',
        paginaAtual + 1,
        paginaAtual === totalPaginas
    );
}

// Cria um botão individual
function criarBotaoPagina(texto, destino, desabilitado) {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.textContent = texto;
    botao.disabled = desabilitado;

    botao.addEventListener('click', () => {
        paginaAtual = destino;
        renderizarAlunos();
    });

    paginacao.appendChild(botao);

    return botao;
}

// Eventos de pesquisa e filtro
campoPesquisa.addEventListener('input', aplicarFiltros);
filtroCurso.addEventListener('change', aplicarFiltros);

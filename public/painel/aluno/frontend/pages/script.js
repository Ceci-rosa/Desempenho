document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('lista-turmas');
    if (!tbody) return;

    // Usuário salvo no login
    let usuario = null;
    try {
        usuario = JSON.parse(localStorage.getItem('usuario'));
    } catch (_) {}

    if (!usuario || !usuario.id) {
        window.location.href = '/login/login.html';
        return;
    }

    // Evita que texto vindo do banco seja interpretado como HTML
    const esc = (txt) => String(txt ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const rotulos = { ATIVA: 'Ativo', INATIVA: 'Inativo', ENCERRADA: 'Encerrada' };

    function linhaTurma(t) {
        const classe = t.status === 'ATIVA' ? 'active' : 'inactive';
        return `
            <tr>
                <td>${esc(t.nome)}</td>
                <td>${esc(t.curso ? t.curso.nome : '-')}</td>
                <td>${esc(t.ano_letivo)}</td>
                <td>${esc(t.vagas ?? '-')}</td>
                <td><span class="class-status ${classe}">${esc(rotulos[t.status] || t.status)}</span></td>
                <td class="class-actions">
                    <button class="edit-button" type="button" aria-label="Editar ${esc(t.nome)}">✎</button>
                    <button class="delete-button" type="button" aria-label="Excluir ${esc(t.nome)}">▤</button>
                </td>
            </tr>`;
    }

    try {
        const resposta = await fetch(`/api/turmas?usuario_id=${encodeURIComponent(usuario.id)}`);
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        const turmas = await resposta.json();

        if (turmas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma turma cadastrada.</td></tr>';
            return;
        }

        tbody.innerHTML = turmas.map(linhaTurma).join('');
    } catch (erro) {
        console.error('Erro ao carregar turmas:', erro);
        tbody.innerHTML = '<tr><td colspan="6">Não foi possível carregar as turmas.</td></tr>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Lê o usuário salvo pelo login
    let usuario = null;
    try {
        usuario = JSON.parse(localStorage.getItem('usuario'));
    } catch (_) {}

    // Sem login, volta para a tela de entrada
    if (!usuario || !usuario.nome) {
        window.location.href = '/login/login.html';
        return;
    }

    // Iniciais: primeira letra do primeiro e do último nome
    const partes = usuario.nome.trim().split(/\s+/);
    const iniciais = (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();

    document.getElementById('boas-vindas').textContent = `Olá, Prof. ${usuario.nome}!`;
    document.getElementById('nome-usuario').textContent = usuario.nome;
    document.getElementById('avatar').textContent = iniciais;
});

// FUNCIONALIDADE DO MENU LATERAL

const menuToggle = document.getElementById('menu-toggle');
const dashboardShell = document.querySelector('.dashboard-shell');

if (menuToggle && dashboardShell) {

    menuToggle.addEventListener('click', () => {

        const mobile = window.matchMedia('(max-width: 600px)').matches;

        if (mobile) {
            // Em celulares, expande ou recolhe o menu
            dashboardShell.classList.toggle('sidebar-expanded');
        } else {
            // Em computadores, recolhe ou expande o menu
            dashboardShell.classList.toggle('sidebar-collapsed');
        }

        atualizarEstadoMenu();
    });

    function atualizarEstadoMenu() {
        const mobile = window.matchMedia('(max-width: 600px)').matches;

        const aberto = mobile
            ? dashboardShell.classList.contains('sidebar-expanded')
            : !dashboardShell.classList.contains('sidebar-collapsed');

        menuToggle.setAttribute('aria-expanded', aberto);
        menuToggle.setAttribute(
            'aria-label',
            aberto ? 'Recolher menu' : 'Expandir menu'
        );
    }
}
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

    // Só preenche o que existir na página
    const boasVindas = document.getElementById('boas-vindas');
    const nomeUsuario = document.getElementById('nome-usuario');
    const avatar = document.getElementById('avatar');

    if (boasVindas) boasVindas.textContent = `Olá, Prof. ${usuario.nome}!`;
    if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
    if (avatar) avatar.textContent = iniciais;

    // Menu lateral
    const menuToggle = document.getElementById('menu-toggle');
    const dashboardShell = document.querySelector('.dashboard-shell');

    if (menuToggle && dashboardShell) {
        const atualizarEstadoMenu = () => {
            const mobile = window.matchMedia('(max-width: 600px)').matches;
            const aberto = mobile
                ? dashboardShell.classList.contains('sidebar-expanded')
                : !dashboardShell.classList.contains('sidebar-collapsed');

            menuToggle.setAttribute('aria-expanded', aberto);
            menuToggle.setAttribute('aria-label', aberto ? 'Recolher menu' : 'Expandir menu');
        };

        menuToggle.addEventListener('click', () => {
            const mobile = window.matchMedia('(max-width: 600px)').matches;
            dashboardShell.classList.toggle(mobile ? 'sidebar-expanded' : 'sidebar-collapsed');
            atualizarEstadoMenu();
        });

        atualizarEstadoMenu();
    }
});
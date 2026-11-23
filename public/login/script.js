const API_URL = '/api/login';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    if (!form) {
        console.error('Formulário #form-login não encontrado. Confira o id no HTML.');
        return;
    }

    const botao = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.elements['email'].value.trim();
        const senha = form.elements['senha'].value;

        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Entrando...';

        try {
            const resposta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            let resultado = {};
            try {
                resultado = await resposta.json();
            } catch (_) {}

            if (resposta.ok) {
                if (!resultado.usuario || !resultado.usuario.nome) {
                    alert('Os dados do usuário não foram recebidos corretamente.');
                    return;
                }

                localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

                alert(resultado.message || 'Login realizado com sucesso!');

                window.location.href = '../painel/painel.html';
        
            } else {
                alert(resultado.error || `Falha no login (${resposta.status}).`);
            }
        } catch (erro) {
            console.error('Erro de conexão:', erro);
            alert('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});
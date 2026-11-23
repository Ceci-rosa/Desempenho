const API_URL = '/api/usuarios';

function cpfValido(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) {
            soma += Number(cpf[i]) * (t + 1 - i);
        }
        const digito = ((soma * 10) % 11) % 10;
        if (digito !== Number(cpf[t])) return false;
    }
    return true;
}

function mascararCpf(valor) {
    return valor
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    if (!form) {
        console.error('Formulário #form-cadastro não encontrado. Confira o id no HTML.');
        return;
    }

    const botao = form.querySelector('button[type="submit"]');
    const campoCpf = form.elements['cpf'];

    campoCpf.addEventListener('input', () => {
        campoCpf.value = mascararCpf(campoCpf.value);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = form.elements['nome'].value.trim();
        const email = form.elements['email'].value.trim();
        const cpf = campoCpf.value.replace(/\D/g, '');
        const senha = form.elements['senha'].value;

        if (nome.length < 3) {
            alert('Informe seu nome completo.');
            return;
        }
        if (!cpfValido(cpf)) {
            alert('CPF inválido.');
            return;
        }
        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Cadastrando...';

        try {
            const resposta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, cpf, senha }),
            });

            let resultado = {};
            try {
                resultado = await resposta.json();
            } catch (_) {}

            if (resposta.ok) {
                alert(resultado.message || 'Cadastro realizado com sucesso!');
                form.reset();
                window.location.href = '/login/login.html';
            } else {
                alert('Erro no cadastro: ' + (resultado.error || `Falha (${resposta.status}). Verifique os dados.`));
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
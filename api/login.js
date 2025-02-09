document.getElementById('loginForm').addEventListener('submit', async (event) => {
event.preventDefault(); // Previne o envio padrão do formulário

    // Obtém os dados do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://infinitysistem.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        // Se login foi bem-sucedido, redireciona para a página de sucesso
        if (data.success && data.redirectTo) {
            window.location.hash = '';  // Limpa o hash para evitar voltar para o login
            window.location.href = data.redirectTo;  // Redireciona para a página de sucesso
        } else {
            // Exibe a mensagem de erro caso o login falhe
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('errorMessage').textContent = data.message || 'Erro ao autenticar';
        }
    } catch (error) {
        // Exibe erro de conexão
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').textContent = 'Erro de conexão com o servidor';
    }
});

const token = localStorage.getItem('authToken');  // Verifique o token no localStorage
if (!token) {
    // Redireciona para a página de login caso o token não exista
    window.location.href = 'login.html';
} else {
    // Se o token existe, faça a requisição ao servidor para a área exclusiva
    fetch('/area-exclusiva', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Envia o token no cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Acesso negado') {
            // Redireciona para o login se o token for inválido
            window.location.href = 'login.html';
        } else {
            // Caso o token seja válido, renderiza a página
            document.getElementById('conteudo').innerHTML = 'Bem-vindo à Área Exclusiva';
        }
    })
    .catch(error => {
        // Em caso de erro (por exemplo, token expirado), redireciona para login
        window.location.href = 'login.html';
    });
}
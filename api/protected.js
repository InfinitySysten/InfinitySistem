const authenticate = (req, res, next) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "login.html";
        return res.status(401).json({ message: 'Acesso negado, token não fornecido' });
    } else {
        // Decodifica e verifica se o token expirou
        const decoded = jwt_decode(token);  // Você pode usar a biblioteca jwt-decode para decodificar o token
        const currentTime = Date.now() / 1000;
    }

    if (decoded.exp < currentTime) {
        localStorage.removeItem("authToken");  // Remove token expirado
        window.location.href = "login.html";  // Redireciona para login
      }
};
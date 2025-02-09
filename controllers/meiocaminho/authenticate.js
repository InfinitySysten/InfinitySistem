const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Verifica o token no cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado, token não fornecido' });
    }

    try {
        // Verifica se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token
        req.user = decoded; // Adiciona os dados do usuário à requisição
        next(); // Chama o próximo middleware ou rota
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};
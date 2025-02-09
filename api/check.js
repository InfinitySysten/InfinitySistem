app.get("/api/check", (req, res) => {
    const token = req.cookies.token; // Obtém o token do cookie

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        jwt.verify(token, SECRET_KEY); // Verifica o token JWT
        res.json({ authenticated: true });
    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
});
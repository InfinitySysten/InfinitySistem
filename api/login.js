app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Procura o usuário no banco
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }
        
        // Verifica a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Gera um token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true });  // Armazena o token em um cookie

        localStorage.setItem("authToken", token);

        res.status(200).json({
            success: true,
            token: token, 
            redirectTo: "area-exclusiva/success.html"  // URL de destino
        });
        
    } catch (error) {
        console.error('Erro ao fazer login:', error); // Exibe o erro completo no console
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
})

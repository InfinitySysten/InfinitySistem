const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://Administrador:Parafa11..@cluster0.x3ss8.mongodb.net/loginDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.log("Erro ao conectar ao MongoDB:", err));

// Rota de registro (cadastrar usuário)
app.post('/api/registro', async (req, res) => {
    const { username, password, nivel } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, nivel });

        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true });  // Armazena o token em um cookie

        res.status(200).json({
            success: true,
            token: token, 
            redirectTo: "area-exclusiva/success.html"  // URL de destino
    });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login', error });
    }
});

// Rota protegida
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

app.get('/area-exclusiva', authenticate, (req, res) => {
    // Somente usuários com um token válido terão acesso
    res.render('area_exclusiva', { dados: { autenticado: true, token: req.cookies.token } });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
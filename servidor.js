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
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['https://infinitysysten.github.io'];  // Domínio específico permitido

app.use(cors({
    origin: function(origin, callback) {
        // Permite o acesso apenas para a origem especificada
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"],  // Permitir métodos HTTP necessários
    credentials: true,  // Permitir o envio de cookies
    allowedHeaders: ['Content-Type', 'Authorization'],  // Permite cabeçalhos necessários
}));

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://Administrador:Parafa11..@cluster0.x3ss8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
    });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login', error });
    }
});

// Rota protegida
const authenticate = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado, token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: 'Bem-vindo à área protegida!', userId: req.user.userId });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Conexão com o banco de dados 'loginDB'
mongoose.connect('mongodb://localhost:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao banco de dados loginDB');
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});

// Criação de um novo usuário
async function createUser() {
  const hashedPassword = await bcrypt.hash('senha123', 8);
  const user = new User({
    username: 'usuario_teste',
    password: hashedPassword
  });

  await user.save();
  console.log('Usuário criado');
}

createUser();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nivel: {type: Number, require: true}
});

module.exports = mongoose.model('User', userSchema);
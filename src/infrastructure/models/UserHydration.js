const mongoose = require('mongoose');

// Esquema: Definimos la estructura
const UserHydrationSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    dailyLogs: {
        // Un Map nos permite guardar claves dinámicas como "2023-10-27": 5
        type: Map,
        of: Number,
        default: {}
    }
});

// Modelo
module.exports = mongoose.model('UserHydration', UserHydrationSchema);
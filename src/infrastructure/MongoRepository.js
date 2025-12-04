const mongoose = require('mongoose');
const UserHydration = require('./models/UserHydration');

class MongoRepository {
    constructor() {
        // En un caso real, la conexión debería estar en el index/config, 
        // pero por simplicidad de inyección la manejamos aquí o pasamos la conexión.
    }

    // Buscar un usuario por ID
    async getUser(userId) {
        try {
            return await UserHydration.findOne({ userId });
        } catch (error) {
            console.error('Error DB Get:', error);
            return null;
        }
    }

    // Crear o Actualizar usuario
    async saveUser(userData) {
        try {
            // upsert: true crea el documento si no existe
            return await UserHydration.findOneAndUpdate(
                { userId: userData.userId },
                userData,
                { new: true, upsert: true }
            );
        } catch (error) {
            console.error('Error DB Save:', error);
        }
    }

    // Método especial para obtener todos (para el ranking)
    async getAllUsers() {
        return await UserHydration.find({});
    }
}

module.exports = MongoRepository;
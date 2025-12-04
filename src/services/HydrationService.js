const DateUtils = require('../utils/dateUtils');

class HydrationService {
    constructor(repository) {
        this.repository = repository;
    }

    async addWater(userId, userName, amount) {
        const today = DateUtils.getTodayKey();

        // 1. Buscamos al usuario en BD (Ahora es una promesa)
        let user = await this.repository.getUser(userId);

        // 2. Si no existe, preparamos el objeto estructura
        if (!user) {
            user = {
                userId: userId.toString(),
                name: userName,
                dailyLogs: {}
            };
        }

        // 3. Lógica de negocio (Aseguramos que dailyLogs sea tratable)
        // Mongoose usa Maps, pero para manipularlo fácil lo tratamos como objeto si es necesario,
        // o usamos los métodos .get() .set() de Mongoose Maps.

        // Si viene de Mongo es un Documento Mongoose, si es nuevo es objeto plano.
        // Estandarizamos para manipular el Map:
        let currentWater = 0;

        if (user.dailyLogs instanceof Map) {
            currentWater = user.dailyLogs.get(today) || 0;
            user.dailyLogs.set(today, currentWater + amount);
        } else {
            // Caso objeto plano (primera vez)
            currentWater = user.dailyLogs[today] || 0;
            user.dailyLogs[today] = currentWater + amount;
        }

        // Actualizamos nombre por si cambió
        user.name = userName;

        // 4. Persistir
        await this.repository.saveUser(user);

        return currentWater + amount;
    }

    async getDailyRanking() {
        const today = DateUtils.getTodayKey();
        const users = await this.repository.getAllUsers();

        // Filtrar y mapear
        const ranking = users
            .map(user => {
                // Manejo de Map vs Objeto
                let count = 0;
                if (user.dailyLogs instanceof Map) {
                    count = user.dailyLogs.get(today) || 0;
                } else {
                    count = user.dailyLogs[today] || 0;
                }

                return {
                    name: user.name,
                    count: count
                };
            })
            .filter(u => u.count > 0) // Solo los que tomaron agua hoy
            .sort((a, b) => b.count - a.count);

        return ranking;
    }
}

module.exports = HydrationService;
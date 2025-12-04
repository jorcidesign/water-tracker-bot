class BotController {
    constructor(hydrationService) {
        this.hydrationService = hydrationService;
    }

    // Middleware para detectar gotas
    async handleMessage(ctx, next) {
        const text = ctx.message.text;

        // Si no es texto o no tiene gotas, pasa al siguiente middleware
        if (!text || !text.includes('💧')) {
            return next();
        }

        const userId = ctx.from.id;
        const userName = ctx.from.first_name;
        // Cuenta ocurrencias de 💧
        const amount = (text.match(/💧/g) || []).length;

        try {
            // CORRECCIÓN AQUÍ: Agregamos 'await' porque ahora vamos a Mongo
            const newTotal = await this.hydrationService.addWater(userId, userName, amount);

            await ctx.reply(`¡Anotado ${userName}! 🌊\n+${amount} hoy.\nTotal diario: ${newTotal} 💧`, {
                reply_to_message_id: ctx.message.message_id
            });
        } catch (error) {
            console.error('Error guardando agua:', error);
            ctx.reply('Hubo un error guardando tu agua. Intenta de nuevo.');
        }
    }

    async showRanking(ctx) {
        try {
            // CORRECCIÓN AQUÍ: Agregamos 'await' también al ranking
            const ranking = await this.hydrationService.getDailyRanking();

            if (ranking.length === 0) {
                return ctx.reply('Nadie ha tomado agua hoy. ¡Empiecen ya! 🌵');
            }

            let msg = '🏆 **RANKING DE HOY** 🏆\n\n';
            ranking.forEach((u, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                msg += `${medal || '🔹'} ${u.name}: ${u.count} 💧\n`;
            });

            ctx.reply(msg);
        } catch (error) {
            console.error('Error obteniendo ranking:', error);
            ctx.reply('No pude traer el ranking ahora mismo.');
        }
    }
}

module.exports = BotController;
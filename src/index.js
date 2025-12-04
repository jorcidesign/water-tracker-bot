const { Telegraf } = require('telegraf');
const mongoose = require('mongoose'); // Importante para conectar
const config = require('./config');
require('dotenv').config();

// Imports de Arquitectura
// const FileRepository = require('./infrastructure/FileRepository'); <--- ADIÓS ARCHIVOS
const MongoRepository = require('./infrastructure/MongoRepository'); // <--- HOLA MONGO
const HydrationService = require('./services/HydrationService');
const BotController = require('./controllers/BotController');

// 0. Conectar a Base de Datos (Infraestructura Global)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Local (Docker) 🍃'))
    .catch(err => console.error('Error conectando a Mongo:', err));

// 1. Inyección de Dependencias
const repository = new MongoRepository();
const service = new HydrationService(repository);
const controller = new BotController(service);

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => ctx.reply('¡Tracker 2.0 con Base de Datos activado! 💧'));

// OJO: handleMessage y showRanking ahora retornan promesas, Telegraf las maneja bien
bot.on('text', controller.handleMessage.bind(controller));
bot.command('ranking', (ctx) => controller.showRanking(ctx));

console.log('Iniciando configuración de arranque...');

if (process.env.NODE_ENV === 'production') {
    // MODO PRODUCCIÓN (RENDER)
    const port = process.env.PORT || 3000;
    const domain = process.env.RENDER_EXTERNAL_URL; 

    if (!domain) {
        throw new Error('Falta RENDER_EXTERNAL_URL en variables de entorno');
    }

    console.log(`🤖 Iniciando en modo Webhook en puerto ${port}`);
    
    // Aquí está la clave: Telegraf levanta un servidor web en el puerto que pide Render
    bot.launch({
        webhook: {
            domain: domain,
            port: port
        }
    }).then(() => {
        console.log('🚀 Webhook atado exitosamente a Render');
    });

} else {
    // MODO DESARROLLO (TU PC)
    console.log('🤖 Iniciando en modo Long Polling (Local)');
    bot.launch();
}

// Graceful Stop
process.once('SIGINT', () => { bot.stop('SIGINT'); mongoose.disconnect(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); mongoose.disconnect(); });

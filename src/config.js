require('dotenv').config();

if (!process.env.BOT_TOKEN) {
    throw new Error('FATAL: BOT_TOKEN no está definido en el archivo .env');
}

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    NODE_ENV: process.env.NODE_ENV || 'development'
};
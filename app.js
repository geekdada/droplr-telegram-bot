'use strict';

const TelegramBot = require('node-telegram-bot-api');
const Droplr = require('droplr-api');
const assert = require('assert');
const onMessage = require('./lib/on-message');

module.exports = app => {
  const config = app.config.bot;

  assert(config.botToken, 'Invalid botToken');
  assert(config.droplrUsername, 'Invalid droplrUsername');
  assert(config.droplrPassword, 'Invalid droplrPassword');

  app.beforeStart(async () => {
    // Telegram
    const bot = new TelegramBot(config.botToken);

    await bot.setWebHook(`${config.baseUri}/bot${config.botToken}`);
    app.telegramBot = bot;

    bot.on('message', msg => {
      onMessage(msg, app, bot)
        .catch(err => {
          app.emit('error', err);
        });
    });

    // Droplr
    const droplr = new Droplr.Client({
      requestDefaults: {
        proxy: false,
      },
      auth: new Droplr.BasicAuth(
        config.droplrUsername,
        config.droplrPassword
      ),
    });
    try {
      await droplr.drops.list();

      app.droplr = droplr;
    } catch (err) {
      app.logger.error('Login Droplr failed!');
    }
  });
};

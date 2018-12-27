'use strict';

const TelegramBot = require('node-telegram-bot-api');
const Droplr = require('droplr-api');
const assert = require('assert');
const onText = require('./lib/on-text');
const onPicture = require('./lib/on-picture');
const onVideo = require('./lib/on-video');
const onAudio = require('./lib/on-audio');
const onDocument = require('./lib/on-document');

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

    bot.on('text', msg => {
      onText(msg, app, bot)
        .catch(err => {
          app.emit('error', err);
        });
    });

    bot.on('photo', msg => {
      onPicture(msg, app, bot)
        .catch(err => {
          app.emit('error', err);
        });
    });

    bot.on('video', msg => {
      onVideo(msg, app, bot)
        .catch(err => {
          app.emit('error', err);
        });
    });

    bot.on('audio', msg => {
      onAudio(msg, app, bot)
        .catch(err => {
          app.emit('error', err);
        });
    });

    bot.on('document', msg => {
      onDocument(msg, app, bot)
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
      const e = new Error('Login to Droplr failed!');
      app.logger.error(e);
      throw e;
    }

    app.logger.info('Application is ready to take messages!');
  });
};

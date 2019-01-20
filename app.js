'use strict';

const Promise = require('bluebird');
const TelegramBot = require('node-telegram-bot-api');
const Droplr = require('droplr-api');
const assert = require('assert');

const onText = require('./lib/on-text');
const onPicture = require('./lib/on-picture');
const onVideo = require('./lib/on-video');
const onAudio = require('./lib/on-audio');
const onDocument = require('./lib/on-document');
const onError = require('./lib/on-error');
const gateway = require('./lib/gateway');

Promise.config({
  cancellation: true,
});
TelegramBot.Promise = Promise;

module.exports = app => {
  const config = app.config.bot;

  assert(config.baseUri, 'Invalid baseUri');
  assert(config.botToken, 'Invalid botToken');
  assert(config.droplrUsername, 'Invalid droplrUsername');
  assert(config.droplrPassword, 'Invalid droplrPassword');
  if (!config.isPublic) {
    assert(config.botMaster, 'Private bot requires botMaster');
  }

  app.beforeStart(async () => {
    // Telegram
    const bot = new TelegramBot(config.botToken);

    await bot.setWebHook(`${config.baseUri}/bot${config.botToken}`);
    app.bot = bot;

    bot.on('text', msg => {
      gateway(msg, app)
        .then(() => onText(msg, app, bot))
        .catch(err => onError(err, msg, app, bot));
    });

    bot.on('photo', msg => {
      gateway(msg, app)
        .then(() => onPicture(msg, app, bot))
        .catch(err => onError(err, msg, app, bot));
    });

    bot.on('video', msg => {
      gateway(msg, app)
        .then(() => onVideo(msg, app, bot))
        .catch(err => onError(err, msg, app, bot));
    });

    bot.on('audio', msg => {
      gateway(msg, app)
        .then(() => onAudio(msg, app, bot))
        .catch(err => onError(err, msg, app, bot));
    });

    bot.on('document', msg => {
      gateway(msg, app)
        .then(() => onDocument(msg, app, bot))
        .catch(err => onError(err, msg, app, bot));
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

'use strict';

const boom = require('boom');

module.exports = async (msg, app) => {
  const { loggers } = app;
  const config = app.config.bot;
  const logger = loggers.botLogger;

  if (!config.isPublic && msg.from.username !== config.botMaster) {
    logger.error('Unauthorized message %j', msg);
    throw boom.unauthorized('You are not the bot master!');
  }
};

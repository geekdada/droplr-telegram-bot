'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_2290070dec1a458f04394794f65b643d';

  config.middleware = [ 'accesslog' ];

  config.logger = {
    dir: path.resolve(appInfo.baseDir, 'logs'),
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.bot = {
    baseUri: process.env.BASE_URI,
    botToken: process.env.BOT_TOKEN,
    droplrUsername: process.env.DROPLR_USERNAME,
    droplrPassword: process.env.DROPLR_PASSWORD,
    isPublic: process.env.BOT_PUBLIC === '1',
    botMaster: process.env.BOT_MASTER,
  };

  config.development = {
    watchDirs: [
      './lib',
    ],
  };

  config.customLogger = {
    botLogger: {
      file: path.resolve(appInfo.baseDir, 'logs/bot.log'),
      level: 'INFO',
      consoleLevel: 'INFO',
    },
  };

  config.axios = {
    timeout: 60000,
  };

  return config;
};

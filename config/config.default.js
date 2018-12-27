'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_2290070dec1a458f04394794f65b643d';

  config.middleware = [ 'accesslog' ];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.bot = {
    baseUri: 'https://frp1.hosts.dada.li',
    botToken: process.env.BOT_TOKEN,
    droplrUsername: process.env.DROPLR_USERNAME,
    droplrPassword: process.env.DROPLR_PASSWORD,
  };

  config.development = {
    watchDirs: [
      './lib',
    ],
  };

  return config;
};

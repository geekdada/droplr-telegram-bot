'use strict';

module.exports = () => {
  const config = {};

  config.axios = {
    timeout: 5000,
  };

  config.logger = {
    consoleLevel: 'INFO',
    level: 'NONE',
    disableConsoleAfterReady: false,
  };

  return config;
};

'use strict';

module.exports = app => {
  const { router } = app;

  router.post(`/bot${app.config.bot.botToken}`, async function(ctx) {
    ctx.app.bot.processUpdate(ctx.request.body);
    ctx.status = 200;
  });
};

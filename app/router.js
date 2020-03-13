'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post(`/bot${app.config.bot.botToken}`, async function(ctx) {
    ctx.app.bot.processUpdate(ctx.request.body);
    ctx.status = 200;
  });

  router.get('/html', controller.api.html);
  router.get('/md', controller.api.markdown);
};

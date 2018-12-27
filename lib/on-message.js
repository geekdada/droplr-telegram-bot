'use strict';

const validator = require('validator');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  app.logger.info(`[on-message] ${msg.message_id} ${msg.text}`);

  try {
    if (validator.isURL(msg.text)) {
      const res = await droplr.drops.create({
        type: 'LINK',
        content: msg.text,
      });

      await bot.sendMessage(msg.chat.id, [
        '*Link Shorten Success*\n\n',
        `Short link: ${res.shortlink}\n`,
        `Long link: ${res.content}`,
      ].join(''), {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } else {
      const res = await droplr.drops.create({
        type: 'NOTE',
        content: msg.text,
      }, {
        headers: {
          'content-type': 'text/markdown',
        },
      });

      await bot.sendMessage(msg.chat.id, [
        '*Note Upload Success*\n\n',
        `Link: ${res.shortlink}`,
      ].join(''), {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }
  } catch (err) {
    app.logger.error('[on-message]', err);
    await bot.sendMessage(msg.chat.id, `# Error Occurred\n\n${err.message}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }
};

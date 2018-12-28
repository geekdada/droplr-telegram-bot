'use strict';

const validator = require('validator');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  app.logger.info(`[on-text] ${msg.chat.id} ${msg.message_id}`);

  try {
    if (validator.isURL(msg.text)) {
      await bot.sendMessage(msg.chat.id, 'Waiting for response..');

      const res = await droplr.drops.create({
        type: 'LINK',
        content: msg.text,
      });

      await bot.sendMessage(msg.chat.id, [
        '*Shorten Link Success*\n\n',
        `Link: ${res.shortlink}`,
      ].join(''), {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } else {
      await bot.sendMessage(msg.chat.id, 'Uploading note..');

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
    app.logger.error('[on-text]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n${err.message}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }
};

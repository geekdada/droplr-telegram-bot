'use strict';

const validator = require('validator');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  app.logger.info(`[on-text] ${msg.chat.id} ${msg.message_id}`);

  try {
    if (validator.isURL(msg.text)) {
      const pendingMsg = await bot.sendMessage(msg.chat.id, 'Waiting for response...', {
        reply_to_message_id: msg.message_id,
      });

      const res = await droplr.drops.create({
        type: 'LINK',
        content: msg.text,
      });

      await bot.editMessageText([
        '*Shorten Link Success*\n\n',
        `Link: ${res.shortlink}`,
      ].join(''), {
        chat_id: msg.chat.id,
        message_id: pendingMsg.message_id,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } else {
      const pendingMsg = await bot.sendMessage(msg.chat.id, 'Uploading note...', {
        reply_to_message_id: msg.message_id,
      });

      const res = await droplr.drops.create({
        type: 'NOTE',
        content: msg.text,
      }, {
        headers: {
          'content-type': 'text/markdown',
        },
      });

      await bot.editMessageText([
        '*Note Upload Success*\n\n',
        `Link: ${res.shortlink}`,
      ].join(''), {
        chat_id: msg.chat.id,
        message_id: pendingMsg.message_id,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }
  } catch (err) {
    app.logger.error('[on-text]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

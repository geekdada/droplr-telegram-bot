'use strict';

const boom = require('boom');

module.exports = async (err, msg, app, bot) => {
  if (!boom.isBoom(err)) {
    app.emit('error', err);
    return;
  }


  const output = err.output;

  await bot.sendMessage(msg.chat.id, [
    '*Error Occurred*\n\n',
    `\`${output.payload.error}: ${output.payload.message}\``,
  ].join(''), {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_to_message_id: msg.message_id,
  });
};

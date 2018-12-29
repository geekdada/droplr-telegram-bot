'use strict';

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { document } = msg;
  app.logger.info(`[on-document] ${msg.chat.id} ${msg.message_id}`);

  const pendingMsg = await bot.sendMessage(msg.chat.id, 'Start Uploading...', {
    reply_to_message_id: msg.message_id,
  });

  try {
    const { file_id: fileId, mime_type: mimeType, file_name: fileName } = document;
    const fileStream = bot.getFileStream(fileId);
    const res = await droplr.drops.create({
      type: 'FILE',
      content: fileStream,
      title: fileName,
      variant: mimeType,
    });

    await bot.editMessageText([
      '*Document Upload Success*\n\n',
      `Link: ${res.shortlink}\n`,
      `Direct Link: ${res.shortlink}+`,
    ].join(''), {
      chat_id: msg.chat.id,
      message_id: pendingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    app.logger.error('[on-document]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

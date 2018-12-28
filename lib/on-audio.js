'use strict';

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { audio, voice } = msg;
  app.logger.info(`[on-audio] ${msg.chat.id} ${msg.message_id}`);

  const pendingMsg = await bot.sendMessage(msg.chat.id, 'Start Uploading...', {
    reply_to_message_id: msg.message_id,
  });

  try {
    const media = audio || voice;
    const { file_id: fileId, mime_type: mimeType } = media;
    const fileStream = bot.getFileStream(fileId);
    const res = await droplr.drops.create({
      type: 'FILE',
      content: fileStream,
      title: fileId,
      variant: mimeType,
    });

    await bot.editMessageText([
      '*Audio Upload Success*\n\n',
      `Link: ${res.shortlink}`,
    ].join(''), {
      chat_id: msg.chat.id,
      message_id: pendingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    app.logger.error('[on-audio]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

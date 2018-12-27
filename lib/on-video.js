'use strict';

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { video } = msg;
  app.logger.info(`[on-video] ${msg.chat.id} ${msg.message_id}`);

  await bot.sendMessage(msg.chat.id, 'Start Uploading...');

  try {
    const { file_id: fileId, mime_type: mimeType } = video;
    const fileStream = bot.getFileStream(fileId);
    const res = await droplr.drops.create({
      type: 'FILE',
      content: fileStream,
      title: fileId,
      variant: mimeType,
    });

    await bot.sendMessage(msg.chat.id, [
      '*Video Upload Success*\n\n',
      `Link: ${res.shortlink}`,
    ].join(''), {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    app.logger.error('[on-video]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n${err.message}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }
};

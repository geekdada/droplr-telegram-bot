'use strict';

const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { photo } = msg;
  app.loggers.botLogger.info(`[on-picture] ${msg.chat.id} ${msg.message_id}`);

  const pendingMsg = await bot.sendMessage(msg.chat.id, 'Start Uploading...', {
    reply_to_message_id: msg.message_id,
  });

  try {
    const { file_id: fileId } = photo.slice(-1)[0];
    const tmpFile = await bot.downloadFile(fileId, '/tmp');
    const buffer = readChunk.sync(tmpFile, 0, fileType.minimumBytes);
    const type = fileType(buffer);
    const tmpFileReadStream = fs.createReadStream(tmpFile);
    const res = await droplr.drops.create({
      type: 'FILE',
      content: tmpFileReadStream,
      title: fileId,
      variant: type.mime,
    });

    await bot.editMessageText([
      '*Image Upload Success*\n\n',
      `Link: ${res.shortlink}\n`,
      `Direct Link: ${res.shortlink}+`,
    ].join(''), {
      chat_id: msg.chat.id,
      message_id: pendingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    app.loggers.botLogger.error('[on-picture]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

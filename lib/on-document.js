'use strict';

const getStream = require('get-stream');
const renderMd = require('./render-md');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { document, caption_entities: entities } = msg;
  let entity;
  let command;

  if (entities && entities.length) {
    entity = entities.find(item => item.type === 'bot_command');
    command = msg.caption.slice(entity.offset, entity.length);
  }

  app.loggers.botLogger.info(`[on-document] ${msg.chat.id} ${msg.message_id}`);

  const pendingMsg = await bot.sendMessage(msg.chat.id, 'Start Uploading...', {
    reply_to_message_id: msg.message_id,
  });

  try {
    const { file_id: fileId, mime_type: mimeType, file_name: fileName } = document;
    const fileStream = bot.getFileStream(fileId);
    let res;
    let directLink;

    switch (command) {
      case '/md': {
        if (mimeType !== 'text/markdown') {
          throw new Error('Please upload markdown document.');
        }

        const file = await getStream(fileStream);
        const html = await renderMd(fileName, file);

        res = await droplr.drops.create({
          type: 'FILE',
          content: html,
          title: fileName + '.html',
          variant: 'text/html',
        });
        directLink = `${app.config.bot.baseUri}/html?url=${encodeURIComponent(res.shortlink + '.html')}`;
      }

        break;
      default: {
        res = await droplr.drops.create({
          type: 'FILE',
          content: fileStream,
          title: fileName,
          variant: mimeType,
        });
      }
    }

    await bot.editMessageText([
      '*Document Upload Success*\n\n',
      `Link: ${res.shortlink}\n`,
      `Direct Link: ${directLink || res.shortlink + '+'}`,
    ].join(''), {
      chat_id: msg.chat.id,
      message_id: pendingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  } catch (err) {
    app.loggers.botLogger.error('[on-document]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

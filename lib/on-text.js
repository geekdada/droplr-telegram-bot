'use strict';

const validator = require('validator');

module.exports = async (msg, app, bot) => {
  const droplr = app.droplr;
  const { entities } = msg;

  try {
    if (entities && entities.length) {
      await onCommand(droplr, msg, app, bot);
    } else {
      await onText(droplr, msg, app, bot);
    }
  } catch (err) {
    app.loggers.botLogger.error('[on-text]', err);
    await bot.sendMessage(msg.chat.id, `*Error Occurred*\n\n\`${err.message}\``, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: msg.message_id,
    });
  }
};

async function onCommand(droplr, msg, app, bot) {
  const { entities } = msg;
  const entity = entities.find(item => item.type === 'bot_command');
  const command = msg.text.slice(entity.offset, entity.length);

  app.loggers.botLogger.info(`[on-text:command] ${msg.chat.id} ${msg.message_id} - ${command}`);

  switch (command) {
    case '/list': {
      const pendingMsg = await bot.sendMessage(msg.chat.id, 'Waiting for response...', {
        reply_to_message_id: msg.message_id,
      });

      const number = msg.text.match(/\d+/);
      const page = number && Number(number[0]) || 1;
      const size = 10;
      const data = await droplr.drops.list({
        offset: (page - 1) * size,
        amount: size,
      });
      const totalPage = Math.ceil(Number(data.count) / size);
      const list = data.results.map(item => {
        let title = item.title || 'No title';

        if (title.length > 35) {
          title = title.slice(0, 35) + '...';
        }
        return `- [${item.type}] <a href="${item.shortlink}">${title}</a> (views: ${item.views})`;
      });

      await bot.editMessageText([
        `<b>Drop List (${page}/${totalPage})</b>\n\n`,
        list.join('\n'),
      ].join(''), {
        chat_id: msg.chat.id,
        message_id: pendingMsg.message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }

      break;
    case '/md':
      await bot.sendMessage(msg.chat.id, 'This action needs a markdown attachment.', {
        reply_to_message_id: msg.message_id,
      });

      break;
    default:
      await bot.sendMessage(msg.chat.id, 'Command not support, please try again.', {
        reply_to_message_id: msg.message_id,
      });
  }
}

async function onText(droplr, msg, app, bot) {
  app.loggers.botLogger.info(`[on-text:text] ${msg.chat.id} ${msg.message_id} - ${msg.text}`);

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
      `Link: ${res.shortlink}\n`,
      `Direct Link: ${res.shortlink}+`,
    ].join(''), {
      chat_id: msg.chat.id,
      message_id: pendingMsg.message_id,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }
}

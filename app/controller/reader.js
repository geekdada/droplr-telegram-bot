'use strict';

const assert = require('assert');
const validator = require('validator');
const rehype = require('rehype');
const visit = require('unist-util-visit');
const is = require('hast-util-is-element');
const url = require('url');

module.exports = app => {
  return class ReaderController extends app.Controller {
    async api() {
      const { ctx } = this;
      let originUrl = ctx.params[0];

      originUrl = originUrl.replace(/^https?:\/(?!\/)/, match => {
        return match + '/'; // Cloudflare may format the path
      });

      try {
        assert(validator.isURL(originUrl), 'Invalid url');
      } catch (error) {
        ctx.throw(422, 'Validation Failed', {
          code: 'invalid_param',
          error,
        });
      }

      originUrl = url.parse(originUrl);
      originUrl.query = ctx.query;

      const parseResult = await this.parse(url.format(originUrl));
      const body = await this.replaceImage(parseResult.content);

      await ctx.render('reader.nj', {
        title: parseResult.title || 'Parsed content',
        body,
      });
    }

    async parse(url) {
      const { ctx } = this;
      const res = await ctx.curl('https://mercury.postlight.com/parser', {
        data: { url },
        dataType: 'json',
        headers: {
          'x-api-key': ctx.app.config.bot.mercuryApiKey,
        },
        timeout: [ 20000, 20000 ],
      });

      return res.data;
    }

    replaceImage(input) {
      return new Promise((resolve, reject) => {
        rehype()
          .use(this.processImgTag)
          .process(input, (err, file) => {
            if (err) {
              reject(err);
            } else {
              resolve(file);
            }
          });
      });
    }

    processImgTag() {
      return function transformer(tree) {
        visit(tree, 'element', (node, index, parent) => {
          let src = node.properties.src;

          if (!parent || !is(node, 'img') || !src) {
            return;
          }

          const parsed = url.parse(src);

          if (parsed.host.indexOf('qpic.cn') > -1) {
            src = `https://bots.dada.li/image/${src}`;
          }

          parent.children[index] = {
            type: 'element',
            tagName: 'img',
            properties: {
              'data-src': src,
              'data-zoomable': '',
              className: [ 'lazyload' ],
            },
          };
        });
      };
    }
  };
};

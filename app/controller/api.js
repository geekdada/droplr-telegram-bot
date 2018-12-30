'use strict';

const axios = require('axios');
const validator = require('validator');
const renderMd = require('../../lib/render-md');

module.exports = app => {
  return class ApiController extends app.Controller {
    async html() {
      const { ctx } = this;
      const url = ctx.query.url;

      if (!url || !validator.isURL(url)) {
        ctx.throw(400);
        return;
      }

      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
        proxy: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        },
      });
      const fileStream = response.data;
      const contentType = response.headers['content-type'];

      if (!contentType || !contentType.startsWith('text/html')) {
        ctx.throw(400);
        return;
      }

      ctx.set('cache-control', 'public, max-age=86400');
      ctx.set('content-type', contentType);
      ctx.body = fileStream;
    }

    async markdown() {
      const { ctx } = this;
      const url = ctx.query.url;

      if (!url || !validator.isURL(url)) {
        ctx.throw(400);
        return;
      }

      const response = await axios({
        method: 'get',
        url,
        proxy: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        },
      });
      const contentType = response.headers['content-type'] || '';

      if (!contentType.startsWith('text/markdown') && !contentType.startsWith('text/plain') && !contentType.startsWith('application/octet-stream')) {
        ctx.throw(400);
        return;
      }

      ctx.set('cache-control', 'public, max-age=86400');
      ctx.set('content-type', 'text/html; charset=utf-8');
      ctx.body = await renderMd(getTitleFromMd(response.data) || 'Parsed: ' + url, response.data);
    }
  };
};

function getTitleFromMd(str) {
  const match = str.match(/^#*(.*)\n/);
  return match && match[1].trim();
}

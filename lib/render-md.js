'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const mutate = require('remark-rehype');
const toc = require('remark-toc');
const highlight = require('remark-highlight.js');
const stringify = require('rehype-stringify');
const doc = require('rehype-document');

const isProd = process.env.NODE_ENV === 'production';
const baseURI = isProd ? 'https://cdn.jsdelivr.net/gh/geekdada/droplr-telegram-bot/app' : process.env.BASE_URI;

module.exports = (title = '', str = '') => {
  return new Promise((resolve, reject) => {
    unified()
      .use(parse)
      .use(toc)
      .use(highlight)
      .use(mutate)
      .use(doc, {
        title,
        css: [
          `${baseURI}/public/markdown.css`,
        ],
        js: [
          `${baseURI}/public/markdown.js`,
        ],
      })
      .use(stringify)
      .process(str, function(err, file) {
        if (err) {
          reject(err);
        } else {
          resolve(String(file));
        }
      });
  });
};

'use strict';

const unified = require('unified');
const parse = require('remark-parse');
const mutate = require('remark-rehype');
const stringify = require('rehype-stringify');
const doc = require('rehype-document');

module.exports = (title = '', str = '') => {
  return new Promise((resolve, reject) => {
    unified()
      .use(parse)
      .use(mutate)
      .use(doc, {
        title,
        css: [],
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

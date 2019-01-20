'use strict';

const path = require('path');
const util = require('util');
const uuid = require('uuid');

module.exports = function accesslogMiddleware(options) {
  // 是否记录图片和js/css
  let skipExt = [];

  if (!options.logImage) {
    skipExt = skipExt.concat([ '.png', '.jpeg', '.jpg', '.ico' ]);
  }
  if (!options.logResource) {
    skipExt = skipExt.concat([ '.js', '.css' ]);
  }

  return async function accesslog(ctx, next) {
    const start = new Date().getTime();
    const requestId = uuid.v4();
    ctx.request.id = ctx.id = requestId;
    ctx.set('x-request-id', requestId);

    await next();

    const responseTime = Math.ceil(new Date().getTime() - start);
    ctx.set('x-response-time', responseTime);

    // 资源文件正常访问时不记录日志
    const ext = path.extname(ctx.url).toLocaleLowerCase();
    const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;

    if (!isSkip) {
      const protocol = ctx.protocol.toUpperCase();
      const version = ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor;
      const status = ctx.status;
      const contentLength = ctx.length || '-';
      const referrer = ctx.get('referrer') || '-';
      const ua = ctx.get('user-agent') || '-';
      const message = util.format('%s/%s %s %sB "%s" "%s" %sms %s',
        protocol, version, status, contentLength, referrer, ua, responseTime, requestId);

      ctx.logger.info(message);
    }
  };
};

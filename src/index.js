const zlib = require('zlib');
const bodyparser = require('koa-bodyparser');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const corsOptions = require('./config/cors');
const isAjax = require('koa-isajax');
const requestId = require('koa-requestid');
const responseTime = require('koa-response-time');

const TIME_POINT = '>>> Koa app middlewares';

const list = [
  helmet(),
  cors(corsOptions),
  compress({
    flush: zlib.Z_SYNC_FLUSH,
    threshold: 1
  }),
  bodyparser({
    enableTypes: ['json'],
    onerror: (error, context) => {
      if (error) {
        if (console.log && typeof console.log === 'object') {
          context.log.error(error);
        } else {
          console.error(error);
        }
      }
      context.throw(422, new Error('Body parse error'));
    }
  }),
  isAjax(),
  requestId(),
  responseTime()
];

module.exports = app => {
  console.time(TIME_POINT);

  const mapper = middleware => app.use(middleware);
  list.map(mapper);

  console.timeEnd(TIME_POINT);
};

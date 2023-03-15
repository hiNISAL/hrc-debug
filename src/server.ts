import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import Cors from 'koa-cors';
import { LogQueueItem } from './interface.common';

const app = new Koa();

app.use(Cors());
app.use(koaBody());

const router = new Router();

router.post('/proxy/console', (ctx) => {
  const body = ctx.request.body;

  const {
    console: _console = [],
  } = body;

  _console.forEach((item: LogQueueItem) => {
    console[item.method](...item.args);
  });

  ctx.body = '';
});

app.use(router.routes());

export default (config: {
  port: number;
} = {
  port: 3000,
}) => {
  const { port = 3000 } = config;

  app.listen(port);
};

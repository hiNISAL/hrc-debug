import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import Cors from 'koa-cors';
import { LogQueueItem } from './interface.common';

const server = (route = '/proxy/console') => {
  const app = new Koa();

  app.use(Cors());
  app.use(koaBody());

  const router = new Router();

  router.post(route, (ctx) => {
    const body = ctx.request.body;

    const {
      console: _console = [],
      prefix = false,
    } = body;

    _console.forEach((item: LogQueueItem) => {
      if (prefix) {
        item.args.shift();
      }
      console[item.method](...item.args);
    });

    ctx.body = '';
  });

  app.use(router.routes());

  return app;
};

export default (config: {
  port: number;
  route?: string;
} = {
  port: 3000,
  route: '/proxy/console',
}) => {
  const { port = 3000 } = config;

  const app = server(config.route);

  app.listen(port);
};

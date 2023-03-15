import { LogQueueItem, proxyMethods } from './interface.common';

type Appear = (queue: LogQueueItem[], server: string) => void;

interface Options {
  server: string,
  appear: Appear,
  beforeEach?: (log: LogQueueItem) => void|LogQueueItem;
}

class HRCDebug {
  static rewriteMethods: proxyMethods[] = ['log', 'warn', 'error'];

  public _console: Console = {} as Console;

  private queue: LogQueueItem[] = [];

  private timer: unknown = null;

  constructor(public readonly options: Options) {
    this.consoleRewrite();
  }

  private consoleRewrite() {
    const gConsole = globalThis.console;

    this._console = { ...gConsole };

    HRCDebug.rewriteMethods.forEach((methodName: proxyMethods) => {
      gConsole[methodName] = (...args) => {
        clearTimeout(this.timer as number);
        this.queue.push({
          method: methodName,
          args,
        });

        this.timer = setTimeout(() => {
          this.appear();
        }, 48);
      };
    });
  }

  private appear() {
    const queue = this.queue;

    if (!queue.length) return;

    this.queue = [];

    const options = this.options;

    queue.forEach((item, idx) => {
      if (options.beforeEach) {
        const returns = options.beforeEach(item);

        if (returns) {
          queue[idx] = returns;
        }
      }
    });

    queue.forEach((item) => {
      this._console[item.method](`[${item.method}]`, ...item.args);
    });

    options.appear(queue, options.server);
  }
}

export default HRCDebug;

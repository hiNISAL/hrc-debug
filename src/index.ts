import { LogQueueItem, proxyMethods } from './interface.common';

type Appear = (queue: LogQueueItem[], server: string) => void;

interface Options {
  server: string;
  appear: Appear;
  beforeEachQueuePost?: (queue: LogQueueItem[]) => void|LogQueueItem[];
  filterMatcher?: string,
}

class HRCDebug {
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // STATIC
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 重写的方法列表
  static rewriteMethods: proxyMethods[] = ['log', 'warn', 'error'];

  // -------------------------------------------------------------------------
  // 重写方法的原生方法映射表，保留原始方法
  static nativeConsoleMethodsMap: Record<proxyMethods, Function> = HRCDebug
    .rewriteMethods
    .reduce((obj, methodName) => {
      obj[methodName] = globalThis.console[methodName];
    }, {} as any);

  // -------------------------------------------------------------------------
  // 默认配置项
  static defaultOptions: Options = {
    server: '',
    appear: () => {},
    filterMatcher: '',
  };

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // PROPS
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // log队列
  private queue: LogQueueItem[] = [];

  // -------------------------------------------------------------------------
  // 上报节流定时器
  private timer: unknown = null;

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // constructor
  // -------------------------------------------------------------------------

  constructor(public readonly options: Options) {
    this.options = Object.assign(HRCDebug.defaultOptions, options);

    this.consoleRewrite();
  }

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // METHODS
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 重写方法
  private consoleRewrite() {
    // 全局的console
    const gConsole: Console = globalThis.console;

    // 从映射表取并复写
    Object
      .entries(HRCDebug.nativeConsoleMethodsMap)
      .forEach(([methodName, method]) => {
        gConsole[methodName as proxyMethods] = (...args: any[]) => {
          // 丢进上报队列
          this.queue.push({
            method: methodName as proxyMethods,
            args,
            createdAt: Date.now(),
          });

          // 抖一下
          if (this.timer) return;
          this.timer = setTimeout(() => {
            this.appear();
            this.timer = null;
          }, 48); // three frames

          // 在客户端输出
          method.call(gConsole, ...args);
        };
      });
  }

  // -------------------------------------------------------------------------
  // 上报
  private appear() {
    let queue = this.queue;

    if (!queue.length) return;

    this.queue = [];

    const options = this.options;

    if (options.filterMatcher) {
      queue = queue.filter(({ args: [first] }) => {
        return first === options.filterMatcher;
      });
    }

    // 调用一下钩子
    if (options.beforeEachQueuePost) {
      const returns = options.beforeEachQueuePost(queue);

      if (returns) {
        queue = returns;
      }
    }

    // 完了上报
    options.appear(queue, options.server);
  }
}

export default HRCDebug;

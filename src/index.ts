import { LogQueueItem, proxyMethods, AppearData } from './interface.common';

type Appear = (data: AppearData, server: string) => Promise<void>;

interface Options {
  server: string;
  appear: Appear;
  beforeEachQueuePost?: (queue: LogQueueItem[]) => void|LogQueueItem[];
  filterMatcher?: string,
}

const getValue = (value: unknown): unknown => {
  // NaN
  if (Number.isNaN(value)) {
    return 'NaN___hrc_NaN';
  }

  // Infinity / -Infinity
  if ((value === Infinity) || (value === -Infinity)) {
    return `${value.toString()}___hrc_Infinity`;
  }

  // undefined
  if (value === undefined) {
    return 'undefined___hrc_Undefined';
  }

  // 基本类型
  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return value;
  }

  // bigint
  if (typeof value === 'bigint') {
    return `${value.toString()}n___hrc_BigInt`;
  }

  // symbol
  if (typeof value === 'symbol') {
    return `${value.toString()}___hrc_Symbol`;
  }

  // function
  if (typeof value === 'function') {
    return `${value.toString()}___hrc_Function`;
  }

  // null
  if (value === null) {
    return null;
  }

  // object
  if (typeof value === 'object') {
    const obj: Record<string, unknown> = {};

    Object.entries(value).forEach(([k, v]) => {
      obj[k] = getValue(v);
    });

    return obj;
  }

  return value;
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

      return obj;
    }, {} as any);

  // -------------------------------------------------------------------------
  // 默认配置项
  static defaultOptions: Options = {
    server: '',
    appear: () => Promise.resolve(),
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
  // 清洗数据
  private consoleMethodArgumentsGen(args: unknown[]) {
    return args.map((item) => {
      return getValue(item);
    });
  }

  // -------------------------------------------------------------------------
  // 是否添加到队列
  private checkAddToQueue(first: unknown): boolean {
    const matcher = this.options.filterMatcher;
    if (matcher) {
      return first === matcher;
    }

    return true;
  }

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
          if (this.checkAddToQueue(args[0])) {
            // 丢进上报队列
            this.queue.push({
              method: methodName as proxyMethods,
              args: this.consoleMethodArgumentsGen(args),
              createdAt: Date.now(),
              sourceArgs: args,
            });

            this.appear();
          }

          // 在客户端输出
          method.call(gConsole, ...args);
        };
      });
  }

  // -------------------------------------------------------------------------
  // 上报
  private appear() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      let queue = this.queue;

      if (!queue.length) {
        this.timer = null;
        return;
      };

      this.queue = [];

      const options = this.options;

      // 调用一下钩子
      if (options.beforeEachQueuePost) {
        const returns = options.beforeEachQueuePost(queue);

        if (returns) {
          queue = returns;
        }
      }

      // 去掉引用
      queue.forEach((item) => {
        delete item.sourceArgs;
      });

      // 完了上报
      options.appear({
        console: queue,
        prefix: !!options.filterMatcher,
      }, options.server).then(() => {
        this.timer = null;
        this.appear();
      });
    }, 166);
  }
}

export default HRCDebug;

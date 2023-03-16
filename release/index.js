"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HRCDebug {
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // constructor
    // -------------------------------------------------------------------------
    constructor(options) {
        this.options = options;
        // -------------------------------------------------------------------------
        // -------------------------------------------------------------------------
        // -------------------------------------------------------------------------
        // PROPS
        // -------------------------------------------------------------------------
        // -------------------------------------------------------------------------
        // log队列
        this.queue = [];
        // -------------------------------------------------------------------------
        // 上报节流定时器
        this.timer = null;
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
    consoleRewrite() {
        // 全局的console
        const gConsole = globalThis.console;
        // 从映射表取并复写
        Object
            .entries(HRCDebug.nativeConsoleMethodsMap)
            .forEach(([methodName, method]) => {
            gConsole[methodName] = (...args) => {
                // 丢进上报队列
                this.queue.push({
                    method: methodName,
                    args,
                    createdAt: Date.now(),
                });
                // 抖一下
                if (this.timer)
                    return;
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
    appear() {
        let queue = this.queue;
        if (!queue.length)
            return;
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
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// STATIC
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// 重写的方法列表
HRCDebug.rewriteMethods = ['log', 'warn', 'error'];
// -------------------------------------------------------------------------
// 重写方法的原生方法映射表，保留原始方法
HRCDebug.nativeConsoleMethodsMap = HRCDebug
    .rewriteMethods
    .reduce((obj, methodName) => {
    obj[methodName] = globalThis.console[methodName];
}, {});
// -------------------------------------------------------------------------
// 默认配置项
HRCDebug.defaultOptions = {
    server: '',
    appear: () => { },
    filterMatcher: '',
};
exports.default = HRCDebug;

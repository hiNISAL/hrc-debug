"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HRCDebug {
    constructor(options) {
        this.options = options;
        this._console = {};
        this.queue = [];
        this.timer = null;
        this.consoleRewrite();
    }
    consoleRewrite() {
        const gConsole = globalThis.console;
        this._console = Object.assign({}, gConsole);
        HRCDebug.rewriteMethods.forEach((methodName) => {
            gConsole[methodName] = (...args) => {
                clearTimeout(this.timer);
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
    appear() {
        const queue = this.queue;
        if (!queue.length)
            return;
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
HRCDebug.rewriteMethods = ['log', 'warn', 'error'];
exports.default = HRCDebug;

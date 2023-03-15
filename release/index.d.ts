import { LogQueueItem, proxyMethods } from './interface.common';
type Appear = (queue: LogQueueItem[], server: string) => void;
interface Options {
    server: string;
    appear: Appear;
    beforeEach?: (log: LogQueueItem) => void | LogQueueItem;
}
declare class HRCDebug {
    readonly options: Options;
    static rewriteMethods: proxyMethods[];
    _console: Console;
    private queue;
    constructor(options: Options);
    private consoleRewrite;
    private appear;
}
export default HRCDebug;

import { LogQueueItem, proxyMethods } from './interface.common';
type Appear = (queue: LogQueueItem[], server: string) => void;
interface Options {
    server: string;
    appear: Appear;
    beforeEachQueuePost?: (queue: LogQueueItem[]) => void | LogQueueItem[];
    filterMatcher?: string;
}
declare class HRCDebug {
    readonly options: Options;
    static rewriteMethods: proxyMethods[];
    static nativeConsoleMethodsMap: Record<proxyMethods, Function>;
    static defaultOptions: Options;
    private queue;
    private timer;
    constructor(options: Options);
    private consoleRewrite;
    private appear;
}
export default HRCDebug;

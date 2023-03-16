export type proxyMethods = 'log' | 'warn' | 'error';
export interface LogQueueItem {
    method: proxyMethods;
    args: unknown[];
    createdAt: number;
}

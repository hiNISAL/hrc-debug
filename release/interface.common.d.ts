export type proxyMethods = 'log' | 'warn' | 'error';
export interface LogQueueItem {
    method: proxyMethods;
    args: unknown[];
    createdAt: number;
    sourceArgs?: unknown[];
}
export interface AppearData {
    prefix: boolean;
    console: LogQueueItem[];
}

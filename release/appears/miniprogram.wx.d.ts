import { AppearData } from '../interface.common';
declare global {
    let wx: any;
}
export declare const appear: (data: AppearData, server: string) => void;

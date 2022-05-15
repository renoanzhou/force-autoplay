/**
 *@file 工具函数
 */
/**
 * 一个简单的深拷贝
 */
export declare function deepCopy<T>(obj: T): T;
export declare function disposeElEvent(element: HTMLElement, event: string, listener: () => void): {
    dispose: () => void;
    listener: () => void;
};
export declare function openDebug(status: boolean): void;
export declare function log(...data: any[]): void;

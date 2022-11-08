/**
 *@file 校验媒体资源是否允许自动播放
 */
import { CheckOptions, CheckResult } from './types';
/**
 * 调用video.play(), 判断是否允许自动播放
 */
export declare function checkPlay(data: {
    media: HTMLMediaElement;
    mutedPlayResult?: boolean;
}): Promise<CheckResult>;
/**
 * 将video静音，校验静音情况下是否允许自动播放
 */
export declare function checkMutedPlay(data: {
    media: HTMLMediaElement;
}): Promise<{
    mutedPlayResult: boolean;
    media: HTMLMediaElement;
}>;
/**
 * 检测media是否允许自动播放
 */
export declare function doCheck(media: HTMLMediaElement, timeout?: number, checkMuted?: boolean): Promise<CheckResult>;
export declare function getMediaSrc(src?: string, mediaType?: string): string;
/**
 *@description 检验是否是否允许自动播放
 */
export declare function canAutoplay(options?: CheckOptions): Promise<CheckResult>;

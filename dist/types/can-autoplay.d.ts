/**
 *@file 校验媒体资源是否允许自动播放
 */
import { CheckOptions, CheckResult } from './types';
/**
 * 检测media是否允许自动播放
 */
export declare function mediaCanAutoPlay(media: HTMLMediaElement, timeout?: number): Promise<CheckResult>;
/**
 *@description 检验是否是否允许自动播放
 */
export declare function canAutoplay(options?: CheckOptions): Promise<CheckResult>;

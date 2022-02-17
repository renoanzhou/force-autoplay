/**
 *@file 给目标绑定点击事件，触发video.play()，播放一个无声音的视频或音频, 然后后续就可以用这个video对象去播放实际的视频
 */
import { ForceOptions, ForceResult } from './types';
/**
 * @description 强制自动播放
 */
export declare function forceAutoplay(options: ForceOptions): Promise<ForceResult>;

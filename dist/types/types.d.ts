/**
 * forceAutoplay.check(config: CheckOptions)校验是否允许自动播放的配置说明
 */
export interface CheckOptions {
    /** 检验media的类型, 默认video */
    mediaType?: 'video' | 'audio';
    /**
     * 自定义要检测的视频地址 【如果要兼容移动端的话，推荐使用自定义的地址！！】
     */
    mediaSrc?: string;
    /**
     * 是否设置playsinline属性
     */
    inline?: boolean;
    /**
     * 超时，单位ms
     * 如果media.play()的一直都没有触发resolve, 则认为自动播放失败
     */
    timeout?: number;
    /**
     * 静音
     */
    muted?: boolean;
    /**
     * 开启debug模式，打印内部函数log数据
     */
    debug?: boolean;
    /**
     * 校验此video能否支持自动播放
     */
    mediaEle?: HTMLMediaElement;
    /**
     * 自定义的属性
     */
    [key: string]: unknown;
}
/**
 * forceAutoplay.check().then(result: CheckResult) promise返回的结果
 */
export interface CheckResult {
    /**
     * 自动播放的结果
     */
    result: boolean;
    /**
     * 失败的原因
     */
    reason?: string;
    /**
     * media对象
     */
    media: HTMLMediaElement;
    /**
     * 视频静音，自动播放的结果
     */
    mutedPlayResult?: boolean;
}
/**
 * forceAutoplay.force(config: ForceOptions)强制自动播放的配置说明
 * 其中有部分配置跟CheckOptions一致，是传给forceAutoplay.check用的，因为force会先调用check做校验
 */
export interface ForceOptions extends CheckOptions {
    /**
     * 给目标对象绑定点击事件, 点击后会预播放视频，单个请传dom对象，多个dom对象需要放数组里
     */
    clickTarget?: HTMLElement | HTMLElement[];
    /**
     * 默认是不会resolve一个失败的结果，如果需要返回异常的情况，可以设置这个timeout
     */
    forceTimeOut?: 2000;
    /**
     * 给document.body添加点击事件去触发预播放
     */
    clickBody?: boolean;
    /**
     * 视频允许静音播放，但是非静音情况不允许播放时，是否触发force函数的resolve， 默认不触发
     */
    mutedResolve?: boolean;
    /**
     * 拓展
     */
    plugins?: Array<(rs: CheckResult) => Promise<CheckResult>>;
}
/**
 * forceAutoplay.force().then(result: ForceResult) 强制自动播放promise返回的结果
 */
export interface ForceResult extends CheckResult {
    media: HTMLMediaElement;
}

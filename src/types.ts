export interface CheckOptions {
  /** 检验media的类型, 默认video */
  mediaType?: 'video' | 'audio';

  /**
   * 自定义要检测的视频地址
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
   * 保留测试时的video对象
   */
  saveMedia?: boolean;

  /**
   * 自定义的属性
   */
  [key: string]: unknown;
}

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
  media?: HTMLMediaElement;
}

export interface ForceOptions extends CheckOptions {
  /**
   * 给目标对象绑定点击事件, 点击后会预播放视频，单个请传dom对象，多个dom对象需要放数组里
   */
  clickTarget?: HTMLElement | HTMLElement[]

  /**
   * 默认是不会resolve一个失败的结果，如果需要返回异常的情况，可以设置这个timeout
   */
  forceTimeOut?: 2000

  /**
   * 校验是否需要静音才能自动播放
   */
  checkMustMuted?: boolean

  /**
   * 拓展
   */
  plugins?: Array<(rs: CheckResult) => Promise<CheckResult>>
}

export interface ForceResult extends CheckResult {
  /**
   * media对象是否需要静音才能播放
   */
  mustMuted?: boolean

  media: HTMLMediaElement
}

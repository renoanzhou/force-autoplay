/**
 *@file 给目标绑定点击事件，触发video.play()，播放一个无声音的视频或音频, 然后后续就可以用这个video对象去播放实际的视频
 */

import { canAutoplay, checkPlay } from './can-autoplay'
import { CheckResult, ForceOptions, ForceResult } from './types'
import { disposeElEvent } from './utils'

const defaultConfig: ForceOptions = {
  mediaType: 'video',
  saveMedia: true,
  muted: false
}

const disposeEventArr: Array<ReturnType<typeof disposeElEvent>> = []

/**
 * @description 强制自动播放
 */
export function forceAutoplay (options?: ForceOptions): Promise<ForceResult> {
  const clickTarget = options?.clickTarget
  const plugins = options?.plugins
  const clickBody = options?.clickBody || false
  const mutedResolve = options?.mutedResolve || false

  const checkConfig = {
    ...defaultConfig,
    ...options
  }

  return canAutoplay(checkConfig).then((rs) => {
    const { result, mutedPlayResult } = rs

    return new Promise<CheckResult>((resolve) => {
      // 视频非静音s2hi能自动播放 或 开启了mutedResolve参数，视频允许静音播放时
      if (result || (mutedResolve && mutedPlayResult)) {
        resolve(rs)
      }

      if (clickTarget) {
        resolve(clickToPrePlay(rs.media, clickTarget))
      }

      if (clickBody) {
        resolve(clickToPrePlay(rs.media, document.body))
      }

      // 如果设置了forceTimeOut， 将会在特定时间返回错误结果
      if (options?.forceTimeOut) {
        setTimeout(() => {
          resolve({
            media: rs.media,
            result: false,
            reason: 'force play timeout'
          })
        }, options.forceTimeOut)
      }

      // 如果配置了plugins, 也会根据plugins的结果返回
      if (plugins) {
        const pluginsPromiseArr = plugins.map(fn => fn(rs))

        Promise.race(pluginsPromiseArr).then((rs) => {
          resolve(rs)
        })
      }
    })
  })
}

/**
 * 通过预点击的方式返回一个支持调用play()的video对象
 */
function clickToPrePlay (media: HTMLMediaElement, target: HTMLElement | HTMLElement[]): Promise<CheckResult> {
  const arr = Array.isArray(target) ? target : [target]

  return new Promise((resolve) => {
    arr.forEach((element) => {
      disposeEventArr.push(
        disposeElEvent(element, 'click', () => {
          // 销毁已注册的点击事件
          while (disposeEventArr.length > 0) disposeEventArr.pop()?.dispose()
          resolve(checkPlay({ media }))
        })
      )
    })
  })
}

export function globalPreClick (media: HTMLMediaElement) {
  return clickToPrePlay(media, [document.body])
}

/**
 *@file 给目标绑定点击事件，触发video.play()，播放一个无声音的视频或音频, 然后后续就可以用这个video对象去播放实际的视频
 */

import { canAutoplay, mediaCanAutoPlay } from './can-autoplay'
import { CheckResult, ForceOptions, ForceResult } from './types'

/**
 * @description 强制自动播放
 */
export function forceAutoplay (options: ForceOptions): Promise<ForceResult> {
  const clickTarget = options.clickTarget
  const plugins = options.plugins
  const checkConfig = Object.assign({
    mediaType: 'video',
    saveMedia: true,
    muted: false
  }, options)

  return canAutoplay(checkConfig).then((rs) => {
    const { result } = rs
    const media = rs.media as HTMLMediaElement

    console.log(rs)

    return new Promise<CheckResult>((resolve) => {
      if (result) {
        resolve(rs)
      }

      if (clickTarget) {
        clickToPrePlay(media, clickTarget).then((rs) => {
          resolve(rs)
        })
      }

      // 如果设置了forceTimeOut， 将会在特定时间返回错误结果
      if (options.forceTimeOut) {
        setTimeout(() => {
          resolve({
            media,
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
    }).then((rs) => {
      return onFulfilled(options, rs)
    })
  })
}

function onFulfilled (options: ForceOptions, rs: CheckResult):Promise<ForceResult> {
  const media = rs.media as HTMLMediaElement

  let forcePromise

  if (options.checkMustMuted) {
    forcePromise = checkMustMuted(media).then((mustMuted) => {
      media.muted = true
      media.pause()

      return Promise.resolve({
        ...rs,
        mustMuted
      })
    })
  } else {
    forcePromise = Promise.resolve(rs)
  }

  return forcePromise.then((rs) => {
    media.muted = true
    media.pause()

    return rs as ForceResult
  })
}

/**
 * 校验media是否需要静音才能播放
 */
function checkMustMuted (media: HTMLMediaElement): Promise<boolean> {
  return new Promise((resolve) => {
    media.muted = false
    media.play().then(() => {
      resolve(false)
    }).catch(() => {
      resolve(true)
    })
  })
}

function setListener (element: HTMLElement | HTMLElement[], handleClick: () => void, type: 'add' | 'remove') {
  if (!Array.isArray(element)) element = [element]

  element.forEach((elementItem) => {
    if (type === 'add') {
      elementItem.addEventListener('click', handleClick)
      elementItem.addEventListener('touchstart', handleClick)
    } else if (type === 'remove') {
      elementItem.removeEventListener('click', handleClick)
      elementItem.removeEventListener('touchstart', handleClick)
    }
  })
}

/**
 * 通过预点击的方式返回一个支持调用play()的video对象
 */
function clickToPrePlay (media: HTMLMediaElement, target: HTMLElement | HTMLElement[]): Promise<CheckResult> {
  return new Promise((resolve) => {
    const handleEvent = () => {
      mediaCanAutoPlay(media).then((rs) => {
        const { result } = rs

        console.log(rs)

        if (result) {
          resolve({
            media,
            result
          })
          setListener(target, handleEvent, 'remove')
        }
      })
    }

    setListener(target, handleEvent, 'add')
  })
}

/**
 *@file 校验媒体资源是否允许自动播放
 */

import * as Media from './media'
import { deepCopy } from './utils'
import { CheckOptions, CheckResult } from './types'

// 备用媒体资源，有些浏览器不支持blob, 就只能使用备用mp4去测试
const backUpCheckMedia = 'https://playertest.polyv.net/player2/force-autoplay/media/video.mp4'

const defaultOptions: CheckOptions = {
  inline: true,
  mediaType: 'video',
  timeout: 250,
  muted: true
}

const defaultAttr = {
  inline: true
}

function setAttr (dom: HTMLMediaElement, options: CheckOptions) {
  const attr = Object.assign(defaultAttr, options)

  for (const key in attr) {
    if (key === 'inline' && attr[key]) {
      dom.setAttribute('playsinline', '')
      dom.setAttribute('webkit-playsinline', '')
    } else if (key in dom) {
      dom.setAttribute(key, attr[key] as string)
    }
  }
}

function setProperty (dom: HTMLMediaElement, options: CheckOptions) {
  for (const key in options) {
    if (key in dom) {
      (dom as any)[key] = options[key]
      delete options[key]
    }
  }
}

/**
 * 检测media是否允许自动播放
 */
export function mediaCanAutoPlay (
  media: HTMLMediaElement,
  timeout?: number
): Promise<CheckResult> {
  return new Promise((resolve) => {
    const playPromise = media.play()

    if (timeout) {
      setTimeout(() => {
        resolve({
          result: false,
          reason: 'media play timeout'
        })
      }, timeout)
    }

    if (playPromise) {
      playPromise
        .then(() => {
          resolve({
            result: true
          })
        })
        .catch((error) => {
          const errMsg = error.message as String
          if (media.src !== backUpCheckMedia && errMsg.indexOf('no supported sources')) {
            media.src = backUpCheckMedia
            return mediaCanAutoPlay(media, 250).then((rs) => {
              resolve(rs)
            })
          }

          resolve({
            result: false,
            reason: error
          })
        })
    } else {
      resolve({
        result: true
      })
    }
  })
}

/**
 *@description 检验是否是否允许自动播放
 */
export function canAutoplay (
  options: CheckOptions = defaultOptions
): Promise<CheckResult> {
  const config = Object.assign(defaultOptions, deepCopy(options))
  const mediaType = config.mediaType === 'audio' ? 'audio' : 'video'
  const media = document.createElement(mediaType)
  const src = config.mediaSrc
    ? config.mediaSrc
    : URL.createObjectURL(mediaType === 'audio' ? Media.AUDIO : Media.VIDEO)

  setAttr(media, config)

  setProperty(media, config)

  media.src = src

  return mediaCanAutoPlay(media, config.timeout).then(onFulFilled)

  function onFulFilled (rs: CheckResult) {
    if (config.saveMedia) {
      rs.media = media
    } else {
      media.remove()
    }

    return rs
  }
}

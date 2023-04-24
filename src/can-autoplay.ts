/**
 *@file 校验媒体资源是否允许自动播放
 */

import * as Media from './media'
import { deepCopy } from './utils'
import { CheckOptions, CheckResult } from './types'

const defaultOptions: CheckOptions = {
  inline: true,
  mediaType: 'video',
  timeout: 250,
  muted: false,
  checkMuted: false
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
 * 调用video.play(), 判断是否允许自动播放
 */
export function checkPlay (data: {
  media: HTMLMediaElement
  mutedPlayResult?: boolean
}): Promise<CheckResult> {
  return new Promise((resolve) => {
    const { media } = data
    const playPromise = media.play()

    if (playPromise) {
      playPromise
        .then(() => {
          resolve({
            result: true,
            ...data
          })
        })
        .catch((error) => {
          resolve({
            result: false,
            reason: error,
            media
          })
        })
    } else {
      resolve({
        result: true,
        ...data
      })
    }
  })
}

/**
 * 将video静音，校验静音情况下是否允许自动播放
 */
export async function checkMutedPlay (data: {
  media: HTMLMediaElement
}) {
  const { media } = data
  media.muted = true

  const rs = await checkPlay(data)

  media.muted = false

  return {
    mutedPlayResult: rs.result,
    media
  }
}

/**
 * 检测media是否允许自动播放
 */
export function doCheck (
  media: HTMLMediaElement,
  timeout?: number,
  checkMuted?: boolean
): Promise<CheckResult> {
  return new Promise((resolve) => {
    if (timeout) {
      setTimeout(() => {
        resolve({
          result: false,
          reason: 'media play timeout',
          media
        })
      }, timeout)
    }

    return checkMuted === true
      ? checkMutedPlay({ media }).then((data) => {
        resolve(checkPlay(data))
      })
      : checkPlay({ media }).then((data) => {
        resolve(data)
      })
  })
}

export function getMediaSrc (src?: string, mediaType = 'video') {
  return src || URL.createObjectURL(mediaType === 'audio' ? Media.AUDIO : Media.VIDEO)
}

/**
 *@description 检验是否是否允许自动播放
 */
export function canAutoplay (
  options: CheckOptions = defaultOptions
): Promise<CheckResult> {
  const config = Object.assign(defaultOptions, deepCopy(options))
  config.mediaEle = options.mediaEle
  const mediaType = config.mediaType === 'audio' ? 'audio' : 'video'
  const media = config.mediaEle || document.createElement(mediaType)

  setAttr(media, config)

  setProperty(media, config)

  media.src = getMediaSrc(config?.mediaSrc, mediaType)
  // 重要！！，最后要将media.src 重置，不然可能会有异常
  return doCheck(media, config.timeout, config.checkMuted).finally(() => { media.src = '' })
}

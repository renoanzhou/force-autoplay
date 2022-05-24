/**
 *@file 校验媒体资源是否允许自动播放
 */

import * as Media from './media'
import { deepCopy, openDebug, log } from './utils'
import { CheckOptions, CheckResult } from './types'

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
          log('function: [checkPlay], result: ', { result: true, ...data }, `video Muted status ${media.muted}`)
          resolve({
            result: true,
            ...data
          })
        })
        .catch((error) => {
          log('function: [checkPlay], result: ', { result: false, reason: error }, `video Muted status ${media.muted}`)
          resolve({
            result: false,
            reason: error,
            media
          })
        })
    } else {
      log('function: [checkPlay], result: ', { result: true, ...data }, `video Muted status ${media.muted}, and PlayPromise not exist !!!!`)
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

  log('function: [checkMutedPlay], result: ', rs, `video Muted status ${media.muted}`)

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
  timeout?: number
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

    return checkMutedPlay({ media }).then((data) => {
      log('function: [doCheck], finally result', data)
      resolve(checkPlay(data))
    })
  })
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

  // 设置debug模式的状态，默认不开启
  openDebug(config.debug || false)

  setAttr(media, config)

  setProperty(media, config)

  media.src = config.mediaSrc ?? URL.createObjectURL(mediaType === 'audio' ? Media.AUDIO : Media.VIDEO)

  log(`function: [canAutoplay], config : ${config}, mediaType: ${mediaType}, src: ${media.src}`)

  return doCheck(media, config.timeout)
}

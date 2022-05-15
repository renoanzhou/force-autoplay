/**
 *@file 工具函数
 */

let IS_OPEN_DEBUG = false

/**
 * 一个简单的深拷贝
 */
export function deepCopy<T> (obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return obj
  }
}

export function disposeElEvent (element: HTMLElement, event: string, listener: () => void) {
  element.addEventListener(event, listener)

  return {
    dispose: () => {
      element.removeEventListener(event, listener)
    },
    listener
  }
};

export function openDebug (status: boolean) {
  IS_OPEN_DEBUG = status
}

export function log (...data: any[]) {
  IS_OPEN_DEBUG && console.log(...data)
}

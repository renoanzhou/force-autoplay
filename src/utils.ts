/**
 *@file 工具函数
 */

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

/**
 * 判断字符串是否是 json 字符串
 * @param str 字符串
 */
export function isJSON(str: unknown): boolean {
  if (typeof str !== 'string') {
    return false
  }

  try {
    return typeof JSON.parse(str) === 'object'
  } catch (e) {
    return false
  }
}

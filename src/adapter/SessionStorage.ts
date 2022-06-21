import { StorageDriver } from '../types/storage-driver'
import { isJSON } from '../utils'

class SessionStorage implements StorageDriver {
  init() {
    //
  }

  get(key: string): any {
    let value = sessionStorage.getItem(key)

    if (isJSON(value)) {
      value = JSON.parse(value)
    }

    return value
  }

  set(key: string, value: string): boolean {
    if (!key) return handleError('set', 'a key')

    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }

    sessionStorage.setItem(key, value)

    return true
  }

  remove(key: string) {
    if (!key) return handleError('remove', 'a key')
    sessionStorage.removeItem(key)
    return true
  }

  getAllKeys(): string[] {
    return Object.keys(sessionStorage)
  }

  clearAll(): void {
    sessionStorage.clear()
  }
}

function handleError(func: string, param?: string) {
  const message = param ? `${func}() requires at least ${param} as its first parameter.` : func
  console.warn(message)
  return false
}

export default SessionStorage

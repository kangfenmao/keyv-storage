import { StorageDriver } from '../types/storage-driver'

class LocalStorage implements StorageDriver {
  init() {
    //
  }

  get(key: string): unknown {
    return localStorage.getItem(key)
  }

  set(key: string, value: string): boolean {
    if (!key) return handleError('set', 'a key')
    localStorage.setItem(key, value)
    return true
  }

  remove(key: string) {
    if (!key) return handleError('remove', 'a key')
    localStorage.removeItem(key)
    return true
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage)
  }
}

function handleError(func: string, param?: string) {
  const message = param ? `${func}() requires at least ${param} as its first parameter.` : func
  console.warn(message)
  return false
}

export default LocalStorage

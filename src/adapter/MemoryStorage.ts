import { StorageDriver } from '../types/storage-driver'

class MemoryStorage implements StorageDriver {
  data: Map<string, any> = new Map()

  init() {
    //
  }

  get(key: string): any {
    return this.data.get(key)
  }

  set(key: string, value: any): boolean {
    if (!key) return handleError('set', 'a key')
    this.data.set(key, value)
    return true
  }

  remove(key: string) {
    if (!key) return handleError('remove', 'a key')
    this.data.delete(key)
    return true
  }

  getAllKeys(): string[] {
    return Array.from(this.data.keys())
  }

  clearAll() {
    this.data = new Map()
  }
}

function handleError(func: string, param?: string) {
  const message = param ? `${func}() requires at least ${param} as its first parameter.` : func
  console.warn(message)
  return false
}

export default MemoryStorage

import { StorageDriver } from '../types/storage-driver'

class MemoryStorage implements StorageDriver {
  data: Map<string, unknown> = new Map()

  init() {
    //
  }

  get(key: string): unknown {
    return this.data.get(key)
  }

  set(key: string, value: unknown): boolean {
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
}

function handleError(func: string, param?: string) {
  const message = param ? `${func}() requires at least ${param} as its first parameter.` : func
  console.warn(message)
  return false
}

export default MemoryStorage

import MemoryStorage from './adapter/MemoryStorage'
import { StorageDriver } from './types/storage-driver'
import { isJSON } from './utils'

class KeyvStorage {
  storage: StorageDriver
  expiredSuffix = ':expired_time'
  envSuffix = ''
  keepSuffix = '{[keep]}'

  constructor(driver: StorageDriver = new MemoryStorage()) {
    this.storage = driver
  }

  async init() {
    await this.storage.init()
    this.removeExpiredKeys()
    console.log('[Storage]', 'SyncStorage is ready!')
  }

  /**
   * Remove expired keys
   * @param {string} key
   */
  private removeExpiredKeys() {
    this.storage.getAllKeys().forEach((k: string) => this.removeExpiredKey(k))
  }

  /**
   * Remove expired key
   * @param {string} key
   */
  private removeExpiredKey(key: string) {
    if (key.indexOf(this.expiredSuffix) > -1) {
      const cacheValue = this.storage.get(key)

      if (!cacheValue) {
        return
      }

      const expiredAtTimestamp = new Date(cacheValue.expired_at).getTime()
      const nowTimestamp = new Date().getTime()
      const expired = expiredAtTimestamp < nowTimestamp
      const systemTimeChanged = !expired && expiredAtTimestamp - nowTimestamp > cacheValue.ttl

      if (expired || systemTimeChanged) {
        this.storage.remove(key)
        this.storage.remove(key.replace(this.expiredSuffix, ''))
      }
    }
  }

  /**
   * Get storage key name
   * @param {string} key
   */
  private getKey(key: string) {
    return `${key}${this.envSuffix}`
  }

  /**
   * Get storage expired key name
   * @param {string} key
   */
  private getExpiredKey(key: string) {
    return `${key}${this.expiredSuffix}${this.envSuffix}`
  }

  /**
   * Get storage value
   * @param {string} key
   */
  get(key: string) {
    const keyName = this.getKey(key)
    const expiredKeyName = this.getExpiredKey(key)

    this.removeExpiredKey(expiredKeyName)

    let value = this.storage.get(keyName)

    if (isJSON(value)) {
      value = JSON.parse(value)
    }

    return value
  }

  /**
   * Set a storage key
   * @param {string} key
   * @param {any} data
   * @param {object} expires
   */
  set(key: string, data: any, { expires }: { expires: Date | null } = { expires: null }) {
    if (data === null || data === undefined) {
      return
    }

    if (expires) {
      if (!(expires instanceof Date)) {
        throw new Error('[Storage] expires params is not a Date type')
      }
      const expiredKey = this.getExpiredKey(key)
      const expiredAt = expires.getTime()
      const nowTimestamp = new Date().getTime()
      this.storage.set(expiredKey, {
        expired_at: expiredAt,
        ttl: expiredAt - nowTimestamp
      })
    }

    if (typeof data === 'object') {
      data = JSON.stringify(data)
    }

    return this.storage.set(this.getKey(key), data)
  }

  /**
   * Is key exists
   * @param {string} key
   */
  exists(key: string) {
    return !!this.get(key)
  }

  /**
   * Remove a storage key
   * @param {string} key
   */
  remove(key: string) {
    return this.storage.remove(this.getExpiredKey(key)) && this.storage.remove(this.getKey(key))
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    this.removeExpiredKeys()
    return this.storage.getAllKeys().map((key: string) => key.replace(this.envSuffix, ''))
  }

  /**
   * Clear storage
   */
  async clear() {
    const keysWillRemove = this.storage
      .getAllKeys()
      .filter((e: string) => e.indexOf(this.keepSuffix) < 0)
    keysWillRemove.forEach((key: string) => this.storage.remove(key))
  }

  /**
   * Clear all
   */
  async clearAll() {
    const keysWillRemove = this.storage.getAllKeys()
    keysWillRemove.forEach((key: string) => this.storage.remove(key))
  }
}

export default KeyvStorage

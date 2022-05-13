import { StorageDriver } from './storage-driver'

export interface KeyvStorageParams {
  driver?: StorageDriver
  env?: string
}

export interface KeyvStorageExpiredValue {
  expired_at: string
  ttl: number
}

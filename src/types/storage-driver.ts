export interface StorageDriver {
  init(): void
  get(key: string): any
  set(key: string, value: any): void
  remove(key: string): boolean
  getAllKeys(): string[]
  clearAll(): void
}

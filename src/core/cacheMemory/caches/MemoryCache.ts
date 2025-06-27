import { CacheBase } from "../CacheBase"

export class MemoryCache extends CacheBase {
  private _cache = new Map<string, any>()
  set(key: string, value: any) {
    this._cache.set(key, value)
  }
  get(key: string) {
    return this._cache.get(key)
  }
  remove(key: string) {
    this._cache.delete(key)
  }
  clear() {
    this._cache.clear()
  }
}

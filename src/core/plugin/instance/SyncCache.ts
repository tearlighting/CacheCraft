import { CacheBase } from "../../cacheMemory"
import { IPaginationPool, IResetCacheData } from "../../paginationPool"
import { IPlugin } from "../IPlugin"

abstract class SyncCache<T extends new (...arg: any) => any> implements IPlugin<T> {
  constructor(protected _key: string, protected _cache: CacheBase) {}
  abstract mount(instance: InstanceType<T>): void
  unmount(instance: InstanceType<T>) {}
}
export class SyncMemoryWithPaginationPoolCache<TData extends Record<string, any>> extends SyncCache<new (...arg: any) => IPaginationPool<TData>> {
  mount(instance: IPaginationPool<TData>): void {
    this._cache.set(this._key, this._cache.get(this._key) || new Map<string, TData>())
    ;(instance as unknown as IResetCacheData<TData>).resetCacheData(this._cache.get(this._key) as Map<string, TData>)
  }
  unmount(instance: IPaginationPool<TData>): void {
    // ;(instance as unknown as IEmitDataUpdate<TData>).setUpdate()
  }
}

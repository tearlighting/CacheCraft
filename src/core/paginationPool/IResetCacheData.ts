/**
 * Interface for plugins that can reset or inject cached data.
 */
export interface IResetCacheData<TTableData extends Record<string, any>> {
  /**
   * Replace or inject a new cache dataset.
   *
   * @param data New cache data as a Map.
   */
  resetCacheData(data: Map<string, TTableData>): void
}

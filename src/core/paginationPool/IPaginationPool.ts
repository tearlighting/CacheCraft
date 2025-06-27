/**
 * PaginationPool interface
 *
 * Provides core methods to manage paginated data with optional caching and manual update abilities.
 */
export interface IPaginationPool<TTableData extends Record<string, any>> {
  /**
   * Fetch paginated data for the specified page number.
   * Optionally filter the data before returning.
   *
   * @param pageNumber The page index to fetch.
   * @param filter Optional filter function to filter page data.
   * @returns Promise that resolves with the filtered page data.
   */
  getPageData(pageNumber: number, filter?: (payload: TTableData) => boolean): Promise<TTableData[]>

  /**
   * Delete cached data in the pool that matches the given filter.
   *
   * @param filter A filter function to select which items to delete.
   */
  deleteFromPool(filter: (payload: TTableData) => boolean): void

  /**
   * Refresh the specified number of pages.
   * Can be async or sync depending on implementation.
   *
   * @param pages Number of pages to refresh.
   */
  refreshPages(pages: number): void | Promise<void>

  /**
   * Clear all cached pages in the pool.
   */
  clearCache(): void | Promise<void>

  /**
   * Manually update the pool with new data.
   *
   * @param data New data to merge into the pool.
   */
  updatePoolManual(data: TTableData[]): void

  /**
   * Reset the page size for pagination.
   *
   * @param pageSize New page size.
   */
  resetPageSize(pageSize: number): void
}

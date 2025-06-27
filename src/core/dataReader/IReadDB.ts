/**
 * IReadDB
 *
 * Interface for reading data from a database-like source,
 * with caching and pagination support.
 */
export interface IReadDB<T extends Record<string, any>> {
  /**
   * Read all data from the underlying data source.
   *
   * @returns Promise resolving to an array of records.
   */
  readDB(): Promise<T[]>

  /**
   * Clear any cached data.
   */
  clearCache(): void

  /**
   * Reread data from the source, limited by the specified number of pages.
   *
   * @param pages Number of pages to reread.
   * @returns Promise resolving to an array of records.
   */
  reReadDBWithPage(pages: number): Promise<T[]>

  /**
   * Flag indicating whether there is more data to read.
   */
  hasMore: boolean

  /**
   * Return to the previous page in the pagination sequence.
   */
  return2PrePage: () => void
}

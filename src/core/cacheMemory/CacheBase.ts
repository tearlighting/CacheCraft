/**
 * CacheBase
 *
 * Abstract base class for a generic cache.
 * Defines common cache operations that concrete implementations must provide.
 */
export abstract class CacheBase {
  /**
   * Store a value in the cache for the given key.
   *
   * @param key Cache key.
   * @param value Value to store.
   */
  abstract set(key: string, value: any): void

  /**
   * Retrieve a value from the cache by key.
   *
   * @param key Cache key.
   * @returns The stored value or undefined if not found.
   */
  abstract get(key: string): any

  /**
   * Remove an entry from the cache by key.
   *
   * @param key Cache key.
   */
  abstract remove(key: string): void

  /**
   * Clear all entries from the cache.
   */
  abstract clear(): void
}

# CacheCraft

A lightweight, composable core utilities library that includes a pagination pool (`PaginationPool`), cache pool, and plugin system.
Designed to keep framework-independent logic reusable across Vue / React / Node projects.

---

## 🚀 Minimal Usage

```ts
import { AmplifyDataReader, PaginationPool, MemoryCache } from "cachecraft"

// Create a data reader (or implement your own IReadDB)
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  // Call your Amplify API here
  return {
    items: [],
    nextToken: null,
  }
})

// Create the pagination pool
const paginationPool = new PaginationPool(dataReader, 100, (x) => x.id)

// Create a cache (optional)
const cache = new MemoryCache()

const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// Inject the cache manually (optional)
paginationPool.resetCacheData(cache[EPaginationCacheKey.Pagination])

// Fetch page 1
paginationPool.getPageData(1).then(console.log)
```

---

## 🔌 Plugin Example

```ts
import { AmplifyDataReader, PaginationPool, withPlugins, MemoryCache, SyncMemoryWithPaginationPoolCache } from "cachecraft"

// Create a data reader
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  return {
    items: [],
    nextToken: null,
  }
})

// Wrap PaginationPool with plugin support
const PaginationPoolWithPlugins = withPlugins(PaginationPool)

const paginationPool = new PaginationPoolWithPlugins(dataReader, 100, (x) => x.id)

// Create a cache
const cache = new MemoryCache()
const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// Mount the plugin (chainable)
paginationPool
  .usePlugin(new SyncMemoryWithPaginationPoolCache(EPaginationCacheKey.Pagination, cache))
  // Chain other plugins if needed
  .getPageData(1)
  .then(console.log)
```

---

## 📌 How to extend

- Implement your own `IReadDB` for any backend
- Create your own `CacheBase` (Redis, localStorage, etc.)
- Write custom plugins (logging, auto-refresh, tracking, etc.)

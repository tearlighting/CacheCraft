# CacheCraft

一个轻量、可组合的核心工具库，包含分页池（PaginationPool）、缓存池（CachePool）、插件机制等。
用于把与框架无关的逻辑单独封装，可用于任何 Vue / React / Node 项目。

---

## 🚀 最小使用示例

```ts
import { AmplifyDataReader, PaginationPool, MemoryCache } from "cachecraft"

// 创建数据读取器（你也可以自己实现 IReadDB）
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  // 在这里调用 Amplify API
  return {
    items: [],
    nextToken: null,
  }
})

// 创建分页池
const paginationPool = new PaginationPool(dataReader, 100, (x) => x.id)

// 创建缓存（可选）
const cache = new MemoryCache()

const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// 手动注入缓存（可选）
paginationPool.resetCacheData(cache[EPaginationCacheKey.Pagination])

// 拉取第一页
paginationPool.getPageData(1).then(console.log)
```

---

## 🔌 插件示例

```ts
import { AmplifyDataReader, PaginationPool, withPlugins, MemoryCache, SyncMemoryWithPaginationPoolCache } from "cachecraft"

// 创建数据读取器
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  return {
    items: [],
    nextToken: null,
  }
})

// 用 withPlugins 包装 PaginationPool
const PaginationPoolWithPlugins = withPlugins(PaginationPool)

const paginationPool = new PaginationPoolWithPlugins(dataReader, 100, (x) => x.id)

// 创建缓存
const cache = new MemoryCache()
const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// 挂载插件（链式）
paginationPool
  .usePlugin(new SyncMemoryWithPaginationPoolCache(EPaginationCacheKey.Pagination, cache))
  // 还可以继续挂载其他插件
  .getPageData(1)
  .then(console.log)
```

---

## 📌 你可以这样扩展

- 实现 `IReadDB` 对接任意后端
- 自定义 `CacheBase` 适配 Redis、localStorage 等
- 自定义插件（自动刷新、埋点、日志等）

# CacheCraft

Vue / React / Node など、フレームワークに依存しないロジックを再利用できる
軽量で拡張性のあるコアユーティリティライブラリです。
ページネーションプール、キャッシュプール、プラグインシステムを含みます。

## 🚀 最小の使い方

```ts
import { AmplifyDataReader, PaginationPool, MemoryCache } from "cachecraft"

// データリーダーを作成（IReadDB を自作しても OK）
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  // Amplify API を呼び出す
  return {
    items: [],
    nextToken: null,
  }
})

// ページネーションプールを作成
const paginationPool = new PaginationPool(dataReader, 100, (x) => x.id)

// キャッシュを作成（オプション）
const cache = new MemoryCache()
const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// キャッシュを手動で注入（オプション）
paginationPool.resetCacheData(cache[EPaginationCacheKey.Pagination])

// 1ページ目を取得
paginationPool.getPageData(1).then(console.log)
```

---

## 🔌 プラグイン拡張例

```ts
import { AmplifyDataReader, PaginationPool, withPlugins, MemoryCache, SyncMemoryWithPaginationPoolCache } from "cachecraft"

// データリーダー
const dataReader = new AmplifyDataReader(({ limit, nextToken }) => {
  return {
    items: [],
    nextToken: null,
  }
})

// withPlugins で PaginationPool をラップ
const PaginationPoolWithPlugins = withPlugins(PaginationPool)

const paginationPool = new PaginationPoolWithPlugins(dataReader, 100, (x) => x.id)

// キャッシュを作成
const cache = new MemoryCache()
const enum EPaginationCacheKey {
  Pagination = "pagination",
}

// プラグインを登録（チェーン可能）
paginationPool
  .usePlugin(new SyncMemoryWithPaginationPoolCache(EPaginationCacheKey.Pagination, cache))
  // 必要に応じて他のプラグインも追加
  .getPageData(1)
  .then(console.log)
```

---

## 📌 拡張方法

- `IReadDB` を自作して任意の API に接続
- `CacheBase` を拡張して Redis、localStorage などに対応
- プラグインで自動更新、ロギング、埋め込みなどを実装

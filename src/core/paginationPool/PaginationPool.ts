import { IPaginationPool } from "./IPaginationPool"
import { IReadDB } from "../dataReader"
import { IResetCacheData } from "./IResetCacheData"

export class PaginationPool<TTableData extends Record<string, any>> implements IPaginationPool<TTableData>, IResetCacheData<TTableData> {
  // private _allData: TTableData[] = []
  private _cacheData: Map<string, TTableData> = new Map()
  private _isDirty = true
  private _allDataCache: TTableData[] = []
  private get _allData() {
    if (this._isDirty) {
      this._allDataCache = [...this._cacheData.values()]
      this._isDirty = false
    }
    return this._allDataCache
  }
  constructor(
    private _dataReader: IReadDB<TTableData>,
    private _pageSize: number,
    private _getKey: (item: TTableData) => string = (item: TTableData) => item.id,
    private _sort?: (x: TTableData, y: TTableData) => number
  ) {}
  deleteFromPool(filter: (payload: TTableData) => boolean): void {
    for (const [id, item] of this._cacheData.entries()) {
      if (filter(item)) {
        this._cacheData.delete(id)
        this._isDirty = true
      }
    }
  }

  resetPageSize(pageSize: number) {
    this._pageSize = pageSize
  }
  async getPageData(pageNumber: number, filter?: (payload: TTableData) => boolean): Promise<TTableData[]> {
    const start = (pageNumber - 1) * this._pageSize
    const end = start + this._pageSize - 1
    const filteredData = filter ? this._allData.filter(filter) : this._allData
    if (this.hasEneughData(end, filteredData)) {
      let sorted = filteredData
      if (this._sort) {
        sorted = [...filteredData].sort(this._sort)
      }
      return sorted.slice(start, end + 1)
    } else if (!this._dataReader.hasMore) {
      let sorted = filteredData
      if (this._sort) {
        sorted = [...filteredData].sort(this._sort)
      }
      this._dataReader.return2PrePage()
      return sorted.slice(Math.min(start, filteredData.length))
    } else {
      this.updatePool(await this._dataReader.readDB())
      return this.getPageData(pageNumber, filter)
    }
  }

  async refreshPages(pages = 3) {
    this.updatePool(await this._dataReader.reReadDBWithPage(pages))
  }
  //当分は使わないと思うけど。
  async clearCache() {
    this._dataReader.clearCache()
    this._cacheData.clear()
    this._isDirty = true
  }
  private hasEneughData(end: number, data: TTableData[]): boolean {
    return end < data.length
  }
  private updatePool(data: TTableData[]) {
    if (data.length) {
      data.forEach((item) => {
        this._cacheData.set(this._getKey(item), item)
      })
      this._isDirty = true
    }
  }

  updatePoolManual(data: TTableData[]) {
    this.updatePool(data)
  }
  resetCacheData(payload: Map<string, TTableData>) {
    this._cacheData = payload
  }
}

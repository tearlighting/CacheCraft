import { sleep } from "@/utils"
import { IReadDB } from "../../dataReader/IReadDB"

interface IAmplifyDataGetter<T extends Record<string, any>> {
  (payload: { limit: number; nextToken?: string | null }): Promise<{ data: T[]; nextToken?: string | null }>
}

export class AmplifyDataReader<T extends Record<string, any>> implements IReadDB<T> {
  hasMore: boolean = true
  private _nextTokenCache: Record<number, string | undefined | null> = {}
  private _currentPage: number = 1
  constructor(private _callback: IAmplifyDataGetter<T>, private _limit: number = 50) {}
  async readDB(): Promise<T[]> {
    let res: T[] = []
    try {
      const { data, nextToken } = await this._callback({ limit: this._limit, nextToken: this._nextTokenCache[this._currentPage] })
      this._nextTokenCache[++this._currentPage] = nextToken
      res = data
    } catch (e) {
      console.error(e)
    } finally {
      if (res.length < this._limit) {
        this.hasMore = false
      } else {
        this.hasMore = true
      }
      return res
    }
  }

  async reReadDBWithPage(page: number): Promise<T[]> {
    if (page <= 0) {
      return []
    }
    try {
      const res = await this.reReadDBWithPage(page - 1)
      //If don't have more data,return directly
      if (page > 1 && res.length < this._limit * page) {
        return res
      }
      await sleep(10)
      const { data, nextToken } = await this._callback({ limit: this._limit, nextToken: this._nextTokenCache[page] })
      this._nextTokenCache[page + 1] = nextToken
      return res.concat(data)
    } catch (e) {
      console.error(e)
      return []
    }
  }
  return2PrePage() {
    this._currentPage = this._currentPage - 1
    this.hasMore = true
  }

  async clearCache() {
    this._nextTokenCache = {}
    this._currentPage = 1
  }
  resetCallback(callback: IAmplifyDataGetter<T>) {
    this._callback = callback
  }
}

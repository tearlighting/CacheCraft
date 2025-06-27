import { IWithPlugins } from "./IWithPlugins"
import { IPlugin } from "./IPlugin"

//@ts-ignore
export function withPlugins<T extends new (...arg: any[]) => any>(Base: T) {
  return class WithPlugins extends Base implements IWithPlugins<T> {
    private _plugins: IPlugin<T>[] = []
    usePlugin(plugin: IPlugin<T>) {
      this._plugins.push(plugin)
      plugin.mount(this as any)
      return this
    }
    destroyPlugin(): boolean {
      if (this._plugins.length === 0) return true
      try {
        this._plugins.forEach((plugin) => plugin.unmount(this as any))
        return true
      } catch (e) {
        return false
      } finally {
        this._plugins = []
      }
    }
  }
}

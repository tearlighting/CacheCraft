import { IPlugin } from "./IPlugin"

export interface IWithPlugins<T extends new (...arg: any[]) => any> {
  usePlugin(plugin: IPlugin<T>): IWithPlugins<T>
  destroyPlugin(): boolean
}

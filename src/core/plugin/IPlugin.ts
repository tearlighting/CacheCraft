export interface IPlugin<T extends new (...arg: any[]) => any> {
  mount(instance: InstanceType<T>): void
  unmount(instance: InstanceType<T>): void
}

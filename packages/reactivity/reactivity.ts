const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function createReactiveObject(target, isReadonly) {
  const targetMap = isReadonly ? readonlyMap : readonlyMap;
  if (targetMap.get(target)) {
    return targetMap.get(target);
  }
  const proxy = new Proxy(target, {});
  targetMap.set(target, proxy);

  return proxy;
}
export function reactive(target) {}

export function shallowReactive(target) {}

export function readonly(target) {}

export function shallowReadonly(target) {}

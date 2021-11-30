import { isObject } from "@vue/shared";
import { mutableHandlers, readonlyHandlers, shallowHandlers, shallowReadonlyHandlers } from "./baseHandlers";

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function createReactiveObject(target, isReadonly, baseHandlers) {
  if (!isObject(target)) return
  const targetMap = isReadonly ? readonlyMap : reactiveMap;
  if (targetMap.get(target)) {
    return targetMap.get(target);
  }
  const proxy = new Proxy(target, baseHandlers);
  targetMap.set(target, proxy);

  return proxy;
}
export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}

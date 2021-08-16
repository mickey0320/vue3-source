import { isObject } from "@vue/shared";
import {
  mutableHandler,
  readonlyHandler,
  shallowHanlder,
  shallowReadonlyHandler,
} from "./baseHandler";

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandler);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowHanlder);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandler);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, false, shallowReadonlyHandler);
}

const reactvieMap = new WeakMap();
function createReactiveObject(target, readonly, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  const exist = reactvieMap.get(target);
  if (exist) {
    return exist;
  }
  const proxy = new Proxy(target, baseHandler);
  reactvieMap.set(target, proxy);

  return proxy;
}
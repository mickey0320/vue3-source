import {
  extend,
  hasChanged,
  hasOwn,
  isArray,
  isIntergerKey,
  isObject,
} from "@vue/shared/src";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";

function createGetter(shallow = false, isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    console.log("get:" + key);
    if (shallow) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter(shallow = false) {
  return function setter(target, key, value, receiver) {
    const hadKey =
      isArray(target) && isIntergerKey(key)
        ? parseInt(key) < target.length
        : hasOwn(target, key);
    if (!hadKey) {
      console.log("新增");
    } else if (hasChanged(target[key], value)) {
      console.log("修改");
    }
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, "set", key, value, target[key]);
    return res;
  };
}

const get = createGetter();
const shallowGet = createGetter(true, false);
const readonlyGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);
const readonlySet = {
  set(target, key) {
    console.log(`set failed on ${key} about ${JSON.stringify(target)}`);
  },
};
export const mutableHandler = {
  get,
  set,
};
export const shallowHanlder = {
  get: shallowGet,
  set: shallowSet,
};
export const readonlyHandler = extend(
  {
    get: readonlyGet,
  },
  readonlySet
);
export const shallowReadonlyHandler = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlySet
);

import { isObject } from "@vue/shared";
import { reactive, readonly } from "./reactivity";
import { track } from "./effect";
import { TrackOpTypes } from "./operators";

function createGetter(isShallow = false, isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key);
    }
    if (isShallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);

    return res;
  };
}
const readonlyObj = {
  set(target, key) {
    console.log(`set fail on ${key}`);
  },
};

const get = createGetter();
const shallowGetter = createGetter(true, false);
const readonlyGetter = createGetter(false, true);
const shallowReadonlyGetter = createGetter(true, true);

const set = createSetter();
const shallowSetter = createSetter();
export const mutableHandlers = {
  get,
  set,
};
export const shallowHandlers = {
  get: shallowGetter,
  set: shallowSetter,
};
export const readonlyHandlers = Object.assign(
  {
    get: readonlyGetter,
  },
  readonlyObj
);
export const shallowReadonlyHandlers = Object.assign(
  {
    get: shallowReadonlyGetter,
  },
  readonlyObj
);

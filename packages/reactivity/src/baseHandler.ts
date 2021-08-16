import { extend, isObject } from "@vue/shared/src"
import { reactive, readonly } from "./reactive"

function createGetter(shallow = false, isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
const get = createGetter()
const shallowGet = createGetter(true, false)
const readonlyGet = createGetter(false, true)
const shallowReadonlyGet = createGetter(true, true)

function createSetter(shallow = false) {
  return function setter(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)

    return res
  }
}
const set = createSetter()
const shallowSet = createSetter(true)
const readonlySet = {
  set(target, key) {
    console.log(`set failed on ${key}`)

  }
}
export const mutableHandler = {
  get,
  set,
}
export const shallowHanlder = {
  shallowGet,
  shallowSet
}
export const readonlyHandler = {

}
export const shallowReadonlyHandler = {}
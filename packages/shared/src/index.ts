export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export const extend = Object.assign

export const isArray = Array.isArray

export function isIntergerKey(val){
  return parseInt(val) + '' === val
}

export function hasOwn(obj, key){
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function hasChanged(val1, val2){
  return val1 !== val2
}
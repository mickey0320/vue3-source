'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(obj) {
    return typeof obj === "object" && obj !== null;
}

function createGetter(shallow, isReadonly) {
    if (shallow === void 0) { shallow = false; }
    if (isReadonly === void 0) { isReadonly = false; }
    return function get(target, key, receiver) {
        var res = Reflect.get(target, key, receiver);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
var get = createGetter();
var shallowGet = createGetter(true, false);
createGetter(false, true);
createGetter(true, true);
function createSetter(shallow) {
    return function setter(target, key, value, receiver) {
        var res = Reflect.set(target, key, value, receiver);
        return res;
    };
}
var set = createSetter();
var shallowSet = createSetter();
var mutableHandler = {
    get: get,
    set: set,
};
var shallowHanlder = {
    shallowGet: shallowGet,
    shallowSet: shallowSet
};
var readonlyHandler = {};
var shallowReadonlyHandler = {};

function reactive(target) {
    return createReactiveObject(target, false, mutableHandler);
}
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowHanlder);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandler);
}
function shallowReadonly(target) {
    return createReactiveObject(target, false, shallowReadonlyHandler);
}
var reactvieMap = new WeakMap();
var readonlyMap = new WeakMap();
function createReactiveObject(target, readonly, baseHandler) {
    if (!isObject(target)) {
        return target;
    }
    var weakMap = readonly ? readonlyMap : reactvieMap;
    var exist = weakMap.get(target);
    if (exist) {
        return exist;
    }
    var proxy = new Proxy(target, baseHandler);
    weakMap.set(target, proxy);
    return proxy;
}

exports.reactive = reactive;
exports.readonly = readonly;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;

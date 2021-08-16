var VueReactivity = (function (exports) {
  'use strict';

  function isObject(obj) {
      return typeof obj === "object" && obj !== null;
  }

  var mutableHandler = {};
  var shallowHanlder = {};
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
  function createReactiveObject(target, readonly, baseHandler) {
      if (!isObject(target)) {
          return target;
      }
      var exist = reactvieMap.get(target);
      if (exist) {
          return exist;
      }
      var proxy = new Proxy(target, baseHandler);
      reactvieMap.set(target, proxy);
      return proxy;
  }

  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));

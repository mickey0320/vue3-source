var VueReactivity = (function (exports) {
  'use strict';

  function isObject(obj) {
      return typeof obj === "object" && obj !== null;
  }
  var extend = Object.assign;
  var isArray = Array.isArray;
  function isIntergerKey(val) {
      return parseInt(val) + '' === val;
  }
  function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function hasChanged(val1, val2) {
      return val1 !== val2;
  }

  function effect(fn, options) {
      if (options === void 0) { options = {}; }
      var effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  var activeEffect;
  var effectStack = [];
  var id = 0;
  function createReactiveEffect(fn, options) {
      var effect = function () {
          activeEffect = effect;
          effectStack.push(effect);
          try {
              return fn();
          }
          finally {
              effectStack.pop();
              activeEffect = effectStack[effectStack.length - 1];
          }
      };
      effect.id = id++;
      effect.__isEffect = true;
      effect.options = options;
      effect.deps = [];
      return effect;
  }
  var targetMap = new WeakMap();
  function track(target, type, key) {
      if (!activeEffect) {
          return;
      }
      var depsMap = targetMap.get(target);
      if (!depsMap) {
          depsMap = new Map();
          targetMap.set(target, depsMap);
      }
      var dep = depsMap.get(key);
      if (!dep) {
          dep = new Set();
          depsMap.set(key, dep);
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
      }
  }
  function trigger(target, type, key, newValue, oldValue) {
      var depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      var effectSet = new Set();
      function add(effects) {
          effects.forEach(function (effect) { return effectSet.add(effect); });
      }
      add(depsMap.get(key));
      effectSet.forEach(function (effect) { return effect(); });
  }

  function createGetter(shallow, isReadonly) {
      if (shallow === void 0) { shallow = false; }
      if (isReadonly === void 0) { isReadonly = false; }
      return function get(target, key, receiver) {
          var res = Reflect.get(target, key, receiver);
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
  function createSetter(shallow) {
      return function setter(target, key, value, receiver) {
          var hadKey = isArray(target) && isIntergerKey(key)
              ? parseInt(key) < target.length
              : hasOwn(target, key);
          if (!hadKey) {
              console.log("新增");
          }
          else if (hasChanged(target[key], value)) {
              console.log("修改");
          }
          var res = Reflect.set(target, key, value, receiver);
          trigger(target, "set", key, value, target[key]);
          return res;
      };
  }
  var get = createGetter();
  var shallowGet = createGetter(true, false);
  var readonlyGet = createGetter(false, true);
  var shallowReadonlyGet = createGetter(true, true);
  var set = createSetter();
  var shallowSet = createSetter();
  var readonlySet = {
      set: function (target, key) {
          console.log("set failed on " + key + " about " + JSON.stringify(target));
      },
  };
  var mutableHandler = {
      get: get,
      set: set,
  };
  var shallowHanlder = {
      get: shallowGet,
      set: shallowSet,
  };
  var readonlyHandler = extend({
      get: readonlyGet,
  }, readonlySet);
  var shallowReadonlyHandler = extend({
      get: shallowReadonlyGet,
  }, readonlySet);

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

  exports.effect = effect;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));

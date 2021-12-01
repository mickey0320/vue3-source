let id = 0;
let activeEffect = null;
const effectStack = [];

function createReactiveEffect(fn, options) {
  function effect() {
    if (!effectStack.includes(effect)) {
      try {
        activeEffect = effect;
        effectStack.push(effect);
        fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  effect.id = id++;
  effect._isEffect = true;
  effect.raw = fn;
  effect.options = options;

  return effect;
}

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();
  }

  return effect;
}

const targetMap = new WeakMap();
export function track(target, type, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

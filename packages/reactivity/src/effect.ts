export function effect(fn, options = {} as any) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();
  }

  return effect;
}

let activeEffect;
const effectStack = [];
let id = 0;
function createReactiveEffect(fn, options) {
  const effect = function () {
    activeEffect = effect;
    effectStack.push(effect);
    try {
      return fn();
    } finally {
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

const targetMap = new WeakMap();
export function track(target, type, key) {
  if (!activeEffect) {
    return;
  }
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

export function trigger(target, type, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effectSet = new Set();
  function add(effects) {
    effects.forEach((effect) => effectSet.add(effect));
  }
  add(depsMap.get(key));

  effectSet.forEach((effect: any) => effect());
}

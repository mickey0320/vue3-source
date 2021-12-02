import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpType } from "./operators";
import { hasChanged, isObject } from "@vue/shared";
import { reactive } from "./reactivity";

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  public _value;
  public __v_isRef = true;
  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue);
  }
  get value() {
    track(this, TrackOpTypes.GET, "value");
    return this._value;
  }
  set value(newValue) {
    if (!hasChanged) {
      trigger(this, TriggerOpType.SET, "value", newValue, this.rawValue);
      this.rawValue = newValue;
      this._value = this.shallow ? newValue : convert(newValue);
    }
  }
}
class ObjectImpl {
  public _value;
  public __v_isRef = true;
  constructor(public target, public key) {
    this._value = target[key];
  }
  get value() {
    return this.target[this.key];
  }
  set value(newValue) {
    this.target[this.key] = newValue;
  }
}
function createRef(val, shallow) {
  return new RefImpl(val, shallow);
}
export function ref(val) {
  return createRef(val, false);
}

export function shallowRef(val) {
  return createRef(val, true);
}

export function toRef(target, key) {
  return new ObjectImpl(target, key);
}

export function toRefs(target) {
  const ret = {};
  for (let key in target) {
    ret[key] = toRef(target, key);
  }

  return ret;
}

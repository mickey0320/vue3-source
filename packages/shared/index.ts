export const isObject = (val) => {
  return typeof val === "object" && val !== null;
};

export const isIntergerKey = (val) => {
  return parseInt(val) + "" === val;
};

export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export const isArray = Array.isArray;

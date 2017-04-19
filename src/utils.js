export const noop = () => {};

const _extend = (dest, obj) => {
  for (const i in obj) dest[i] = obj[i];
  return dest;
}
export const clone = (obj) => _extend({}, obj)
export const extend = (dest, obj) => _extend(clone(dest), obj)

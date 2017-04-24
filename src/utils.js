export const noop = () => {}

export const each = (items, fn) => {
  for (const i in items) {
    fn(items[i], i)
  }
}

const _extend = (dest, obj) => {
  for (const i in obj) dest[i] = obj[i]
  return dest
}
export const clone = (obj) => _extend({}, obj)
export const extend = (dest, obj) => _extend(clone(dest), obj)

export const extend = (destObj, ...args) => {
  for (const i in args) {
    const obj = args[i];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        destObj[key] = val;
      }
    }
  }
  return destObj
}

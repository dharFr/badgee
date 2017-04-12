'use strict'

extend = (destObj, args...) ->
  for obj in args
    (destObj[key] = value if obj.hasOwnProperty key) for key, value of obj
  return destObj

module.exports =
  extend: extend

import { noop, each } from './utils.js'
// Homogeneisation of the console API on different browsers
//  - add compat console object if not available
//  - some methods might not be defined. fake them with `noop` function

const console = this.console || {};

// For the record, every single console methods and properties :
// ["memory", "exception", "debug", "error", "info", "log", "warn", "dir",
// "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile",
// "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
// "group", "groupCollapsed", "groupEnd", "clear"]
//
// Focus on logging methods and ignore profiling/timeline methods or less used methods
const methods             = ['debug', 'error', 'group', 'groupCollapsed', 'info', 'log', 'warn'];
const unformatableMethods = ['clear', 'dir', 'groupEnd'];

export const eachFormatableMethod   = (fn) => { each(methods, fn) }
export const eachUnformatableMethod = (fn) => { each(unformatableMethods, fn) }
export const eachMethod = (fn) => {
  eachFormatableMethod(fn)
  eachUnformatableMethod(fn)
}

eachMethod((method) => {
  console[method] = console[method] || noop;
})

export default console

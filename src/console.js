import { noop, each } from './utils.js'
// Homogeneisation of the console API on different browsers
//  - add compat console object if not available
//  - some methods might not be defined. fake them with `noop` function

const console = this.console || {};

const checkConsoleMethods = (methodList) => {
  each(methodList, (method) => {
    if (!console[method]) {
      console[method] = noop;
    }
  })
};

// For the record, every single console methods and properties :
// ["memory", "exception", "debug", "error", "info", "log", "warn", "dir",
// "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile",
// "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
// "group", "groupCollapsed", "groupEnd", "clear"]
//
// Focus on logging methods and ignore profiling/timeline methods or less used methods
const methods             = ['debug', 'error', 'group', 'groupCollapsed', 'info', 'log', 'warn'];
const unformatableMethods = ['clear', 'dir', 'groupEnd'];

checkConsoleMethods(methods)
checkConsoleMethods(unformatableMethods)

export const eachFormatableMethod   = (fn) => { each(methods, fn) }
export const eachUnformatableMethod = (fn) => { each(unformatableMethods, fn) }

export default console

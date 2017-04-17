import { noop } from './utils.js'
// Homogeneisation of the console API on different browsers
//  - add compat console object if not available
//  - some methods might not be defined. fake them with `noop` function
//  - some "methods" might not be functions but properties (eg. profile & profileEnd in IE11)

const console = this.console || {};

const checkConsoleMethods = (methodList) => {
  const ret = [];
  for (const i in methodList) {
    const method = methodList[i]
    if (!console[method]) {
      console[method] = noop;
      ret.push(method);
    } else if (typeof console[method] !== 'function') {
      properties.push(method);
    } else {
      ret.push(method);
    }
  }
  return ret;
};

// For the record, every single console methods and properties
// ["memory", "exception", "debug", "error", "info", "log", "warn", "dir",
// "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile",
// "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
// "group", "groupCollapsed", "groupEnd", "clear"]
const properties = [
  'memory'
];

const methods = checkConsoleMethods([
  'debug', 'dirxml', 'error', 'group',
  'groupCollapsed', 'info', 'log', 'warn'
]);

const unformatableMethods = checkConsoleMethods([
  'assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline',
  'profile', 'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp',
  'timeline', 'timelineEnd'
]);

export {
  properties,
  methods,
  unformatableMethods
}
export default console

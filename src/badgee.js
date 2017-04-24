/* eslint-disable no-console */
/*! badgee v1.2.0 - MIT license */
import { noop, extend, each } from './utils.js'
import console, {
  eachMethod, eachFormatableMethod, eachUnformatableMethod
} from './console.js'
import { config, configure } from './config.js';
import styles from './styles.js';
import { getFilter, isFiltered } from './filter.js';

const store = {};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
const argsForBadgee = function(label, style, parentName) {
  let args = [];

  if (!config.styled) { style = false; }
  if (parentName) {
    const parent = store[parentName];
    args = argsForBadgee(parent.badgee.label, parent.style, parent.parent);
  }

  if (label) {
    // concat formated label for badges output
    // (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
    const formatedLabel = !style ? `[${label}]` : `%c${label}`
    args[0] = `${args[0] || ''}${formatedLabel}`
  }

  if (style) {
    args.push(styles.stringForStyle(style));
  }

  return args;
};

// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
const _defineMethods = function(style, parentName) {
  // get arguments to pass to console object
  const args = argsForBadgee(this.label, style, parentName);

  if (!config.enabled || isFiltered(args[0])) {
    // disable everything
    eachMethod((method) => this[method] = noop)
    return
  }

  // Define Badgee 'formatable' methods form console object
  eachFormatableMethod((method) => {
    this[method] = console[method].bind(console, ...args);
  })

  // Define Badgee 'unformatable' methods form console object
  eachUnformatableMethod((method) => {
    this[method] = console[method].bind(console);
  })
};

// ==================================

class Badgee {

  constructor(label, style, parentName) {
    // Define Badgee methods form console object
    this.label = label;
    _defineMethods.bind(this, style, parentName)();

    // Store instance for later reference
    store[this.label] = {
      badgee: this,
      style,
      parent: parentName
    };
  }

  // Defines a new Badgee instance with @ as parent Badge
  define(label, style) {
    return new Badgee(label, style, this.label);
  }
}

// ==================================

const redefineMethodsForAllBadges = () => {
  each(store, (b) => {
    _defineMethods.bind(b.badgee, b.style, b.parent)()
  })
}

// Create public Badgee instance
let b = new Badgee;

// Augment public instance with utility methods
b.style = styles.style;
b.defaultStyle  = styles.defaults;
b.get = label => (store[label] || {}).badgee;
b.filter = getFilter(redefineMethodsForAllBadges)

b.config = function(conf) {
  // when conf is updated, redefine every badgee method
  if (conf) {
    configure(conf)
    redefineMethodsForAllBadges();
  }
  return config;
};

// Some browsers don't allow to use bind on console object anyway
// fallback to default if needed
try {
  b.log();
} catch (e) {
  b = extend(console, {
    define       : () => b,
    style        : b.style,
    defaultStyle : b.defaultStyle,
    filter       : b.filter,
    get          : () => b,
    config       : () => b.config,
  });
}

export default b;

/* eslint-disable no-console */
/*! badgee v1.2.0 - MIT license */
import { noop } from './utils.js'
import console, {
  eachFormatableMethod, eachUnformatableMethod
} from './console.js'
import config from './config';
import Store from './store';
import styles from './styles';

let currentConf = config();
const store     = new Store;

let filter = {
  include : null,
  exclude : null
};

// concat foramted label for badges output
// (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
const concatLabelToOutput = function(out, label, hasStyle) {
  if (out == null) { out = ''; }
  if (hasStyle == null) { hasStyle = false; }
  return `${out}${
    hasStyle ? '%c' : '['
  }${label}${
    !hasStyle ? ']' : ''
  }`;
};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
const argsForBadgee = function(label, style, parentName) {
  let args = [];

  if (!currentConf.styled) { style = false; }
  if (parentName) {
    const parent = store.get(parentName);
    args = argsForBadgee(parent.badgee.label, parent.style, parent.parent);
  }

  if (label) {
    args[0] = concatLabelToOutput(args[0], label, !!style);
  }

  if (style) {
    args.push(styles.stringForStyle(style));
  }

  return args;
};

// Define empty Badgee methods
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
const _disable = function() {
  const disableMethod = (method) => this[method] = noop;
  eachFormatableMethod(disableMethod)
  eachUnformatableMethod(disableMethod)
};


// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
const _defineMethods = function(style, parentName) {
  if (!currentConf.enabled) {
    _disable.bind(this)();
  } else {
    // get arguments to pass to console object
    const args = argsForBadgee(this.label, style, parentName);

    // Reset style for FF :
    // Defining a last style to an unknown property seems to reset to the default
    // behavior on FF
    if (style && (args.length > 1)) {
      args[0] += '%c';
      args.push('p:a');
    }

    const isntInclusive = (filter.include != null) && !filter.include.test(args[0]);
    const isExclusive   = filter.exclude != null ? filter.exclude.test(args[0]) : undefined;
    if (isntInclusive || isExclusive) {
      _disable.bind(this)();
    } else {
      // Define Badgee 'formatable' methods form console object
      eachFormatableMethod((method) => {
        this[method] = console[method].bind(console, ...args);
      })

      // Define Badgee 'unformatable' methods form console object
      eachUnformatableMethod((method) => {
        this[method] = console[method].bind(console);
      })
    }
  }
};

// ==================================

class Badgee {

  constructor(label, style, parentName) {
    // Define Badgee methods form console object
    this.label = label;
    _defineMethods.bind(this, style, parentName)();

    // Store instance for later reference
    store.add(this.label, {
      badgee: this,
      style,
      parent: parentName
    });
  }

  // Defines a new Badgee instance with @ as parent Badge
  define(label, style) {
    return new Badgee(label, style, this.label);
  }
}

// ==================================

// Create public Badgee instance
let b = new Badgee;

const redefineMethodsForAllBadges = () =>
  store.each((label, b) => _defineMethods.bind(b.badgee, b.style, b.parent)())
;

// Augment public instance with utility methods
b.style         = styles.style;
b.defaultStyle  = styles.defaults;
b.get           = label => __guard__(store.get(label), x => x.badgee);
b.filter        = {
  none() {
    filter = {
      include   : null,
      exclude : null
    };
    redefineMethodsForAllBadges();
    return b.filter;
  },

  include(matcher) {
    if (matcher == null) { matcher = null; }
    if (matcher !== filter.include) {
      filter.include   = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  },

  exclude(matcher) {
    if (matcher == null) { matcher = null; }
    if (matcher !== filter.exclude) {
      filter.exclude = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  }
};

b.config      = function(conf) {
  currentConf = config(conf);
  // when conf is updated, redefine every badgee method
  if (conf) {
    redefineMethodsForAllBadges();
  }
  return currentConf;
};

// Some browsers don't allow to use bind on console object anyway
// fallback to default if needed
try {
  b.log();
} catch (e) {
  const fallback = console;
  fallback.define = () => console;
  fallback.style  = b.style;
  fallback.styleDefaults = b.styleDefaults;
  fallback.filter = b.filter;
  fallback.get    = () => console;
  fallback.config = () => b.config;
  b = fallback;
}

export default b;


function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

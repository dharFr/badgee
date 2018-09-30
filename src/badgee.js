/* eslint-disable no-console */
/*! badgee v1.2.0 - MIT license */
import { noop, each } from './utils.js'
import console, {
  eachMethod, eachFormatableMethod, eachUnformatableMethod
} from './console.js'
import { config, configure } from './config.js';
import { styles, defaultStyle, style2Str } from './styles.js';
import { getFilter, isFiltered } from './filter.js';

const store = {};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
const argsForBadgee = function(label, style, parentName) {
  let args = [];

  if (parentName) {
    const [badgee, style, parent] = store[parentName];
    args = argsForBadgee(badgee.label, style, parent);
  }

  if (label) {
    // concat formated label for badges output
    // (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
    const formatedLabel = !style ? `[${label}]` : `%c${label}`
    args[0] = `${args[0] || ''}${formatedLabel}`
  }

  if (style) {
    args.push(style2Str(style));
  }

  return args;
};

// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
const _defineMethods = function(style, parentName) {
  // get arguments to pass to console object
  const args = argsForBadgee(this.label, config.styled ? style : false, parentName);

  if (!config.enabled || isFiltered(args[0])) {
    // disable everything
    eachMethod((method) => this[method] = noop)
  }
  else {
    // Define Badgee 'formatable' methods form console object
    eachFormatableMethod((method) => {
      // bind() might not be defined in some browsers (e.g. IE9)
      try {
        this[method] = console[method].bind(console, ...args);
      }
      catch(e) {
        this[method] = console[method];
      }
    });

    // Define Badgee 'unformatable' methods form console object
    eachUnformatableMethod((method) => {
      // bind() might not be defined in some browsers (e.g. IE9)
      try {
        this[method] = console[method].bind(console);
      }
      catch(e) {
        this[method] = console[method];
      }
    });
  }

};

// ==================================

class Badgee {

  constructor(label, style, parentName) {
    // Define Badgee methods form console object
    this.label = label;
    _defineMethods.bind(this, style, parentName)();

    // Store instance for later reference
    store[label] = [this, style, parentName];
  }

  // Defines a new Badgee instance with @ as parent Badge
  define(label, style) {
    return new Badgee(label, style, this.label);
  }
}

// ==================================

const redefineMethodsForAllBadges = () => {
  each(store, ([badgee, style, parent]) => {
    _defineMethods.bind(badgee, style, parent)()
  })
}

// Create public Badgee instance
const b = new Badgee;

// Augment public instance with getter method
b.get = (label) => (store[label] || {})[0];

// Augment public instance with a few utility methods
b.style = styles;
b.defaultStyle  = defaultStyle;
b.filter = getFilter(redefineMethodsForAllBadges)
b.config = function(conf) {
  // when conf is updated, redefine every badgee method
  if (conf && typeof conf==='object') {
    configure(conf)
    redefineMethodsForAllBadges();
  }
  return config;
};

export default b;

var noop = function () {};

var each = function (items, fn) {
  for (var i in items) {
    fn(items[i], i);
  }
};

var _extend = function (dest, obj) {
  for (var i in obj) { dest[i] = obj[i]; }
  return dest
};
var clone = function (obj) { return _extend({}, obj); };
var extend = function (dest, obj) { return _extend(clone(dest), obj); };

// Homogeneisation of the console API on different browsers
//  - add compat console object if not available
//  - some methods might not be defined. fake them with `noop` function

var console = window.console || {};

// For the record, every single console methods and properties :
// ["memory", "exception", "debug", "error", "info", "log", "warn", "dir",
// "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile",
// "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
// "group", "groupCollapsed", "groupEnd", "clear"]
//
// Focus on logging methods and ignore profiling/timeline methods or less used methods
var methods             = ['debug', 'error', 'group', 'groupCollapsed', 'info', 'log', 'warn'];
var unformatableMethods = ['clear', 'dir', 'groupEnd'];

var eachFormatableMethod   = function (fn) { each(methods, fn); };
var eachUnformatableMethod = function (fn) { each(unformatableMethods, fn); };
var eachMethod = function (fn) {
  eachFormatableMethod(fn);
  eachUnformatableMethod(fn);
};

eachMethod(function (method) {
  console[method] = console[method] || noop;
});

// default configuration
var defaults = {
  enabled : true,
  styled  :  true
};

var config = clone(defaults);

var configure = function(conf) {
  // update conf
  if (typeof conf === 'object') {
    config = extend(defaults, conf);
  }

  // return current conf
  return config;
};

// Create store to save styles
var store$1 = {};

// Default properties for styles
var defaultsStyle = {
  'border-radius': '2px',
  'padding'      : '1px 3px',
  'margin'       : '0 1px',
  'color'        : 'white'
};

var styles = {
  // define a new style or list existing ones
  style: function style(name, style$1) {
    if (name != null && style$1 != null) {
      style$1 = extend(defaultsStyle, style$1);
      store$1[name] = style$1;
    }
    else if (name != null) {
      return store$1[name];
    }
    return Object.keys(store$1);
  },

  defaults: function defaults(style) {
    if (style != null) {
      defaultsStyle = style;
    }
    return defaultsStyle;
  },

  stringForStyle: function stringForStyle(name) {
    var res = [];
    each(store$1[name], function (style, k) {
      res.push((k + ":" + style + ";"));
    });
    return res.join('');
  }
};


// define a few styles
var empty = {};
var black = {'color': 'black'};

styles.style('green',   extend(empty, {'background': 'green'}));
styles.style('red',     extend(empty, {'background': 'red'}));
styles.style('orange',  extend(black, {'background': 'orange'}));

var filter = {
  include : null,
  exclude : null
};

function isFiltered(str) {
  var isntIncluded = (filter.include != null) && !filter.include.test(str);
  var isExcluded = (filter.exclude != null) && filter.exclude.test(str);
  return isntIncluded || isExcluded
}

function getFilter(onFilterChange) {
  return {
    none: function none() {
      filter.include = null;
      filter.exclude = null;

      onFilterChange();
      return this;
    },

    include: function include(matcher) {
      if ( matcher === void 0 ) matcher = null;

      if (matcher !== filter.include) {
        filter.include = matcher;
        onFilterChange();
      }
      return this;
    },

    exclude: function exclude(matcher) {
      if ( matcher === void 0 ) matcher = null;

      if (matcher !== filter.exclude) {
        filter.exclude = matcher;
        onFilterChange();
      }
      return this;
    }
  };
}

/* eslint-disable no-console */
/*! badgee v1.2.0 - MIT license */
var store = {};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
var argsForBadgee = function(label, style, parentName) {
  var args = [];

  if (!config.styled) { style = false; }
  if (parentName) {
    var parent = store[parentName];
    args = argsForBadgee(parent.badgee.label, parent.style, parent.parent);
  }

  if (label) {
    // concat formated label for badges output
    // (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
    var formatedLabel = !style ? ("[" + label + "]") : ("%c" + label);
    args[0] = "" + (args[0] || '') + formatedLabel;
  }

  if (style) {
    args.push(styles.stringForStyle(style));
  }

  return args;
};

// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
var _defineMethods = function(style, parentName) {
  var this$1 = this;

  // get arguments to pass to console object
  var args = argsForBadgee(this.label, style, parentName);

  if (!config.enabled || isFiltered(args[0])) {
    // disable everything
    eachMethod(function (method) { return this$1[method] = noop; });
    return
  }

  // Define Badgee 'formatable' methods form console object
  eachFormatableMethod(function (method) {
    this$1[method] = (ref = console[method]).bind.apply(ref, [ console ].concat( args ));
    var ref;
  });

  // Define Badgee 'unformatable' methods form console object
  eachUnformatableMethod(function (method) {
    this$1[method] = console[method].bind(console);
  });
};

// ==================================

var Badgee = function Badgee(label, style, parentName) {
  // Define Badgee methods form console object
  this.label = label;
  _defineMethods.bind(this, style, parentName)();

  // Store instance for later reference
  store[this.label] = {
    badgee: this,
    style: style,
    parent: parentName
  };
};

// Defines a new Badgee instance with @ as parent Badge
Badgee.prototype.define = function define (label, style) {
  return new Badgee(label, style, this.label);
};

// ==================================

var redefineMethodsForAllBadges = function () {
  each(store, function (b) {
    _defineMethods.bind(b.badgee, b.style, b.parent)();
  });
};

// Create public Badgee instance
var b = new Badgee;

// Augment public instance with utility methods
b.style = styles.style;
b.defaultStyle  = styles.defaults;
b.get = function (label) { return (store[label] || {}).badgee; };
b.filter = getFilter(redefineMethodsForAllBadges);

b.config = function(conf) {
  // when conf is updated, redefine every badgee method
  if (conf) {
    configure(conf);
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
    define       : function () { return b; },
    style        : b.style,
    defaultStyle : b.defaultStyle,
    filter       : b.filter,
    get          : function () { return b; },
    config       : function () { return b.config; },
  });
}

var b$1 = b;

export default b$1;
//# sourceMappingURL=badgee.es.js.map

var noop = function () {};

var extend = function (destObj) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  for (var i in args) {
    var obj = args[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var val = obj[key];
        destObj[key] = val;
      }
    }
  }
  return destObj
};

// Homogeneisation of the console API on different browsers
//  - add compat console object if not available
//  - some methods might not be defined. fake them with `noop` function
//  - some "methods" might not be functions but properties (eg. profile & profileEnd in IE11)

var console = window.console || {};

var checkConsoleMethods = function (methodList) {
  var ret = [];
  for (var i in methodList) {
    var method = methodList[i];
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
var properties = [
  'memory'
];

var methods = checkConsoleMethods([
  'debug', 'dirxml', 'error', 'group',
  'groupCollapsed', 'info', 'log', 'warn'
]);

var unformatableMethods = checkConsoleMethods([
  'assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline',
  'profile', 'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp',
  'timeline', 'timelineEnd'
]);

// default configuration
var defaults = {
  enabled : true,
  styled  :  true
};

var config = extend({}, defaults);

var configure$1 = function(conf) {
  // update conf
  if (typeof conf === 'object') {
    config = extend({}, defaults, conf);
  }

  // return current conf
  return config;
};

var Store = function Store() {
  this._store = {};
};

// Add object to store
Store.prototype.add = function add (name, obj) {
  this._store[name] = obj;
};

// get obj from store
Store.prototype.get = function get (name) {
  return this._store[name] || null
};

Store.prototype.list = function list () {
  return Object.keys(this._store);
};

Store.prototype.each = function each (func) {
    var this$1 = this;

  for (var name in this$1._store) {
    var obj = this$1._store[name];
    func(name, obj);
  }
};

// Create store to save styles
var store$1 = new Store;

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
      style$1 = extend({}, defaultsStyle, style$1);
      store$1.add(name, style$1);
    }
    else if (name != null) {
      return store$1.get(name);
    }
    return store$1.list();
  },

  defaults: function defaults(style) {
    if (style != null) {
      defaultsStyle = style;
    }
    return defaultsStyle;
  },

  stringForStyle: function stringForStyle(name) {
    var style = store$1.get(name);
    return ((function () {
      var result = [];
      for (var k in style) {
        var v = style[k];
        var item = (void 0);
        if (style.hasOwnProperty(k)) {
          item = k + ":" + v + ";";
        }
        result.push(item);
      }
      return result;
    })()).join('');
  }
};


// define a few styles

var black = {'color': 'black'};

styles.style('black',   extend({}, {'background': 'black'}));
styles.style('blue',    extend({}, {'background': 'blue'}));
styles.style('brown',   extend({}, {'background': 'brown'}));
styles.style('gray',    extend({}, {'background': 'gray'}));
styles.style('green',   extend({}, {'background': 'green'}));
styles.style('purple',  extend({}, {'background': 'purple'}));
styles.style('red',     extend({}, {'background': 'red'}));
styles.style('cyan',    extend({}, black, {'background': 'cyan'}));
styles.style('magenta', extend({}, black, {'background': 'magenta'}));
styles.style('orange',  extend({}, black, {'background': 'orange'}));
styles.style('pink',    extend({}, black, {'background': 'pink'}));
styles.style('yellow',  extend({}, black, {'background': 'yellow'}));

/* eslint-disable no-console */
/*! badgee v1.2.0 - MIT license */
var currentConf = configure$1();
var store     = new Store;

var filter = {
  include : null,
  exclude : null
};

// concat foramted label for badges output
// (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
var concatLabelToOutput = function(out, label, hasStyle){
  if (out == null) { out = ''; }
  if (hasStyle == null) { hasStyle = false; }
  return ("" + out + (hasStyle ? '%c' : '[') + label + (!hasStyle ? ']' : ''));
};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
var argsForBadgee = function(label, style, parentName) {
  var args = [];

  if (!currentConf.styled) { style = false; }
  if (parentName) {
    var parent = store.get(parentName);
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
var _disable = function() {
  var this$1 = this;

  for (var i in methods) {
    var method = methods[i];
    this$1[method] = noop;
  }
  for (var i$1 in unformatableMethods) {
    var method$1 = unformatableMethods[i$1];
    this$1[method$1] = noop;
  }
};


// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
var _defineMethods = function(style, parentName) {
  var this$1 = this;


  if (!currentConf.enabled) {
    return _disable.bind(this)();
  } else {
    // get arguments to pass to console object
    var args = argsForBadgee(this.label, style, parentName);

    // Reset style for FF :
    // Defining a last style to an unknown property seems to reset to the default
    // behavior on FF
    if (style && (args.length > 1)) {
      args[0] += '%c';
      args.push('p:a');
    }

    var isntInclusive = (filter.include != null) && !filter.include.test(args[0]);
    var isExclusive   = filter.exclude != null ? filter.exclude.test(args[0]) : undefined;
    if (isntInclusive || isExclusive) {
      _disable.bind(this)();
    } else {
      // Define Badgee 'formatable' methods form console object
      for (var i in methods) {
        var method = methods[i];
        this$1[method] = (ref = console[method]).bind.apply(ref, [ console ].concat( Array.from(args) ));
      }

      // Define Badgee 'unformatable' methods form console object
      for (var i$1 in unformatableMethods) {
        var method$1 = unformatableMethods[i$1];
        this$1[method$1] = console[method$1].bind(console);
      }
    }

    // Define Badgee properties from console object
    return properties.map(function (prop) { return (this$1[prop] = console[prop]); });
  }
  var ref;
};

// ==================================

var Badgee = function Badgee(label, style, parentName) {
  // Define Badgee methods form console object
  this.label = label;
  _defineMethods.bind(this, style, parentName)();

  // Store instance for later reference
  store.add(this.label, {
    badgee: this,
    style: style,
    parent: parentName
  });
};

// Defines a new Badgee instance with @ as parent Badge
Badgee.prototype.define = function define (label, style) {
  return new Badgee(label, style, this.label);
};

// ==================================

// Create public Badgee instance
var b = new Badgee;

var redefineMethodsForAllBadges = function () { return store.each(function (label, b) { return _defineMethods.bind(b.badgee, b.style, b.parent)(); }); };

// Augment public instance with utility methods
b.style         = styles.style;
b.defaultStyle  = styles.defaults;
b.get           = function (label) { return __guard__(store.get(label), function (x) { return x.badgee; }); };
b.filter        = {
  none: function none() {
    filter = {
      include   : null,
      exclude : null
    };
    redefineMethodsForAllBadges();
    return b.filter;
  },

  include: function include(matcher) {
    if (matcher == null) { matcher = null; }
    if (matcher !== filter.include) {
      filter.include   = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  },

  exclude: function exclude(matcher) {
    if (matcher == null) { matcher = null; }
    if (matcher !== filter.exclude) {
      filter.exclude = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  }
};

b.config      = function(conf) {
  currentConf = configure$1(conf);
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
  var fallback = console;
  fallback.define = function () { return console; };
  fallback.style  = b.style;
  fallback.styleDefaults = b.styleDefaults;
  fallback.filter = b.filter;
  fallback.get    = function () { return console; };
  fallback.config = function () { return b.config; };
  b = fallback;
}

var b$1 = b;


function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

export default b$1;
//# sourceMappingURL=badgee.es.js.map

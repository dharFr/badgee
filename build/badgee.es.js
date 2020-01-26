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

var console = (typeof window !== "undefined" ? window : global).console || {};

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
  if (conf) {
    config = extend(defaults, conf);
  }

  // return current conf
  return config;
};

// Create store to save styles
var store = {};

// Default properties for styles
var defaultsStyle = {
  'border-radius': '2px',
  'padding'      : '1px 3px',
  'margin'       : '0 1px',
  'color'        : 'white'
};

// define a new style or list existing ones
var styles = function (name, style) {
  if (name != null && style != null) {
    style = extend(defaultsStyle, style);
    store[name] = style;
  }
  else if (name != null) {
    return store[name];
  }
  return Object.keys(store);
};

var defaultStyle = function (style) {
  if (style != null) {
    defaultsStyle = style;
  }
  return defaultsStyle;
};

var style2Str = function (name) {
  var res = '';
  each(store[name], function (style, k) {
    res += k + ":" + style + ";";
  });
  return res
};

// define a few styles
var buildStyle = function (base, bkgColor) { return extend(base, {'background': bkgColor}); };

each(['green', 'red'], function (color) {
  styles(color, buildStyle({}, color));
});
styles('orange', buildStyle({'color': 'black'}, 'orange'));

var include = null;
var exclude = null;

var isFiltered = function (str) {
  return ((include != null) && !include.test(str)) //isntIncluded
    || ((exclude != null) && exclude.test(str)) // isExcluded
};

var getFilter = function (onFilterChange) {
  return {
    none: function none() {
      include = null;
      exclude = null;

      onFilterChange();
      return this;
    },

    include: function include$1(matcher) {
      if (matcher !== include) {
        include = matcher;
        onFilterChange();
      }
      return this
    },

    exclude: function exclude$1(matcher) {
      if (matcher !== exclude) {
        exclude = matcher;
        onFilterChange();
      }
      return this
    }
  };
};

/* eslint-disable no-console */

var store$1 = {};

// Given a label, style and parentName, generate the full list of arguments to
// pass to console method to get a foramted output
var argsForBadgee = function(label, style, parentName) {
  var args = [];

  if (parentName) {
    var ref = store$1[parentName];
    var badgee = ref[0];
    var style$1 = ref[1];
    var parent = ref[2];
    args = argsForBadgee(badgee.label, style$1, parent);
  }

  if (label) {
    // concat formated label for badges output
    // (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
    var formatedLabel = !style ? ("[" + label + "]") : ("%c" + label);
    args[0] = "" + (args[0] || '') + formatedLabel;
  }

  if (style) {
    args.push(style2Str(style));
  }

  return args;
};

// Define Badgee methods form console object
// Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
var _defineMethods = function(style, parentName) {
  var this$1 = this;

  // get arguments to pass to console object
  var args = argsForBadgee(this.label, config.styled ? style : false, parentName);

  if (!config.enabled || isFiltered(args[0])) {
    // disable everything
    eachMethod(function (method) { return this$1[method] = noop; });
  }
  else {
    // Define Badgee 'formatable' methods form console object
    eachFormatableMethod(function (method) {
      var ref;

      this$1[method] = (ref = console[method]).bind.apply(ref, [ console ].concat( args ));
    });

    // Define Badgee 'unformatable' methods form console object
    eachUnformatableMethod(function (method) {
      this$1[method] = console[method].bind(console);
    });
  }

};

// ==================================

var Badgee = function Badgee(label, style, parentName) {
  // Define Badgee methods form console object
  this.label = label;
  _defineMethods.bind(this, style, parentName)();

  // Store instance for later reference
  store$1[label] = [this, style, parentName];
};

// Defines a new Badgee instance with @ as parent Badge
Badgee.prototype.define = function define (label, style) {
  return new Badgee(label, style, this.label);
};

// ==================================

var redefineMethodsForAllBadges = function () {
  each(store$1, function (ref) {
    var badgee = ref[0];
    var style = ref[1];
    var parent = ref[2];

    _defineMethods.bind(badgee, style, parent)();
  });
};

// Create public Badgee instance
var b = new Badgee;

// Augment public instance with getter method
b.get = function (label) { return (store$1[label] || {})[0]; };

// Augment public instance with a few utility methods
b.style = styles;
b.defaultStyle  = defaultStyle;
b.filter = getFilter(redefineMethodsForAllBadges);
b.config = function(conf) {
  // when conf is updated, redefine every badgee method
  if (conf && typeof conf==='object') {
    configure(conf);
    redefineMethodsForAllBadges();
  }
  return config;
};

export default b;
//# sourceMappingURL=badgee.es.js.map

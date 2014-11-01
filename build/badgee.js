!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.badgee=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){

/*! badgee v1.2.0 - MIT license */
'use strict';
var Badgee, Store, argsForBadgee, b, concatLabelToOutput, config, currentConf, e, fallback, filter, method, methods, noop, properties, redefineMethodsForAllBadges, store, styles, unformatableMethods, _defineMethods, _disable, _i, _len, _ref,
  __slice = [].slice;

properties = ['memory'];

methods = ['debug', 'dirxml', 'error', 'group', 'groupCollapsed', 'info', 'log', 'warn'];

unformatableMethods = ['assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline', 'profile', 'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp', 'timeline', 'timelineEnd'];

noop = function() {};

global.console = global.console || {};

_ref = methods.concat(unformatableMethods);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  method = _ref[_i];
  if (!console[method]) {
    console[method] = noop;
  }
}

config = _dereq_('./config');

Store = _dereq_('./store');

styles = _dereq_('./styles');

currentConf = config();

store = new Store;

filter = {
  include: null,
  exclude: null
};

concatLabelToOutput = function(out, label, hasStyle) {
  if (out == null) {
    out = '';
  }
  if (hasStyle == null) {
    hasStyle = false;
  }
  return "" + out + (hasStyle ? '%c' : '[') + label + (!hasStyle ? ']' : '');
};

argsForBadgee = function(label, style, parentName) {
  var args, parent;
  args = [];
  if (!currentConf.styled) {
    style = false;
  }
  if (parentName) {
    parent = store.get(parentName);
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

_disable = function() {
  var _j, _k, _len1, _len2, _results;
  for (_j = 0, _len1 = methods.length; _j < _len1; _j++) {
    method = methods[_j];
    this[method] = noop;
  }
  _results = [];
  for (_k = 0, _len2 = unformatableMethods.length; _k < _len2; _k++) {
    method = unformatableMethods[_k];
    _results.push(this[method] = noop);
  }
  return _results;
};

_defineMethods = function(style, parentName) {
  var args, prop, _j, _k, _l, _len1, _len2, _len3, _ref1, _ref2, _results;
  if (!currentConf.enabled) {
    return _disable.bind(this)();
  } else {
    args = argsForBadgee(this.label, style, parentName);
    if (style && args.length > 1) {
      args[0] += '%c';
      args.push('p:a');
    }
    if (((filter.include != null) && !filter.include.test(args[0])) || ((_ref1 = filter.exclude) != null ? _ref1.test(args[0]) : void 0)) {
      _disable.bind(this)();
    } else {
      for (_j = 0, _len1 = methods.length; _j < _len1; _j++) {
        method = methods[_j];
        this[method] = (_ref2 = console[method]).bind.apply(_ref2, [console].concat(__slice.call(args)));
      }
      for (_k = 0, _len2 = unformatableMethods.length; _k < _len2; _k++) {
        method = unformatableMethods[_k];
        this[method] = console[method].bind(console);
      }
    }
    _results = [];
    for (_l = 0, _len3 = properties.length; _l < _len3; _l++) {
      prop = properties[_l];
      _results.push(this[prop] = console[prop]);
    }
    return _results;
  }
};

Badgee = (function() {
  function Badgee(label, style, parentName) {
    this.label = label;
    _defineMethods.bind(this, style, parentName)();
    store.add(this.label, {
      badgee: this,
      style: style,
      parent: parentName
    });
  }

  Badgee.prototype.define = function(label, style) {
    return new Badgee(label, style, this.label);
  };

  return Badgee;

})();

b = new Badgee;

redefineMethodsForAllBadges = function() {
  return store.each(function(label, b) {
    return _defineMethods.bind(b.badgee, b.style, b.parent)();
  });
};

b.style = styles.style;

b.defaultStyle = styles.defaults;

b.get = function(label) {
  var _ref1;
  return (_ref1 = store.get(label)) != null ? _ref1.badgee : void 0;
};

b.filter = {
  none: function() {
    filter = {
      include: null,
      exclude: null
    };
    redefineMethodsForAllBadges();
    return b.filter;
  },
  include: function(matcher) {
    if (matcher == null) {
      matcher = null;
    }
    if (matcher !== filter.include) {
      filter.include = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  },
  exclude: function(matcher) {
    if (matcher == null) {
      matcher = null;
    }
    if (matcher !== filter.exclude) {
      filter.exclude = matcher;
      redefineMethodsForAllBadges();
    }
    return b.filter;
  }
};

b.config = function(conf) {
  currentConf = config(conf);
  if (conf) {
    redefineMethodsForAllBadges();
  }
  return currentConf;
};

try {
  b.log();
} catch (_error) {
  e = _error;
  fallback = console;
  fallback.define = function() {
    return console;
  };
  fallback.style = b.style;
  fallback.styleDefaults = b.styleDefaults;
  fallback.filter = b.filter;
  fallback.get = function() {
    return console;
  };
  fallback.config = function() {
    return b.config;
  };
  b = fallback;
}

module.exports = b;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":2,"./store":3,"./styles":4}],2:[function(_dereq_,module,exports){
'use strict';
var config, configure, defaults, extend;

extend = _dereq_('./utils').extend;

defaults = {
  enabled: true,
  styled: true
};

config = extend({}, defaults);

configure = function(conf) {
  if (typeof conf === 'object') {
    config = extend({}, defaults, conf);
  }
  return config;
};

module.exports = configure;


},{"./utils":5}],3:[function(_dereq_,module,exports){
'use strict';
var Store;

Store = (function() {
  function Store() {
    this._store = {};
  }

  Store.prototype.add = function(name, obj) {
    return this._store[name] = obj;
  };

  Store.prototype.get = function(name) {
    if (this._store[name]) {
      return this._store[name];
    } else {
      return null;
    }
  };

  Store.prototype.list = function() {
    var name, obj, _ref, _results;
    _ref = this._store;
    _results = [];
    for (name in _ref) {
      obj = _ref[name];
      _results.push(name);
    }
    return _results;
  };

  Store.prototype.each = function(func) {
    var name, obj, _ref, _results;
    _ref = this._store;
    _results = [];
    for (name in _ref) {
      obj = _ref[name];
      _results.push(func(name, obj));
    }
    return _results;
  };

  return Store;

})();

module.exports = Store;


},{}],4:[function(_dereq_,module,exports){
'use strict';
var Store, black, defaults, extend, store, styles;

Store = _dereq_('./store');

extend = _dereq_('./utils').extend;

store = new Store;

defaults = {
  'border-radius': '2px',
  'padding': '1px 3px',
  'margin': '0 1px',
  'color': 'white'
};

styles = {
  style: function(name, style) {
    if ((name != null) && (style != null)) {
      style = extend({}, defaults, style);
      store.add(name, style);
    } else if (name != null) {
      return store.get(name);
    } else {
      return store.list();
    }
  },
  defaults: function(style) {
    if (style != null) {
      defaults = style;
    }
    return defaults;
  },
  stringForStyle: function(name) {
    var k, style, v;
    style = store.get(name);
    return ((function() {
      var _results;
      _results = [];
      for (k in style) {
        v = style[k];
        _results.push(style.hasOwnProperty(k) ? "" + k + ":" + v + ";" : void 0);
      }
      return _results;
    })()).join('');
  }
};

black = {
  'color': 'black'
};

styles.style('black', extend({}, {
  'background': 'black'
}));

styles.style('blue', extend({}, {
  'background': 'blue'
}));

styles.style('brown', extend({}, {
  'background': 'brown'
}));

styles.style('gray', extend({}, {
  'background': 'gray'
}));

styles.style('green', extend({}, {
  'background': 'green'
}));

styles.style('purple', extend({}, {
  'background': 'purple'
}));

styles.style('red', extend({}, {
  'background': 'red'
}));

styles.style('cyan', extend({}, black, {
  'background': 'cyan'
}));

styles.style('magenta', extend({}, black, {
  'background': 'magenta'
}));

styles.style('orange', extend({}, black, {
  'background': 'orange'
}));

styles.style('pink', extend({}, black, {
  'background': 'pink'
}));

styles.style('yellow', extend({}, black, {
  'background': 'yellow'
}));

module.exports = styles;


},{"./store":3,"./utils":5}],5:[function(_dereq_,module,exports){
'use strict';
var extend,
  __slice = [].slice;

extend = function() {
  var args, destObj, key, obj, value, _i, _len;
  destObj = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  for (_i = 0, _len = args.length; _i < _len; _i++) {
    obj = args[_i];
    for (key in obj) {
      value = obj[key];
      if (obj.hasOwnProperty(key)) {
        destObj[key] = value;
      }
    }
  }
  return destObj;
};

module.exports = {
  extend: extend
};


},{}]},{},[1])
(1)
});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.badgee = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*! badgee v1.2.0 - MIT license */
'use strict';
var Badgee, Store, _defineMethods, _disable, argsForBadgee, b, checkConsoleMethods, concatLabelToOutput, config, currentConf, e, error, fallback, filter, methods, noop, properties, redefineMethodsForAllBadges, store, styles, unformatableMethods,
  slice = [].slice;

properties = ['memory'];

methods = ['debug', 'dirxml', 'error', 'group', 'groupCollapsed', 'info', 'log', 'warn'];

unformatableMethods = ['assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline', 'profile', 'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp', 'timeline', 'timelineEnd'];

noop = function() {};

this.console = this.console || {};

checkConsoleMethods = function(methodList) {
  var i, len, method, ret;
  ret = [];
  for (i = 0, len = methodList.length; i < len; i++) {
    method = methodList[i];
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

methods = checkConsoleMethods(methods);

unformatableMethods = checkConsoleMethods(unformatableMethods);

config = require('./config');

Store = require('./store');

styles = require('./styles');

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
  var i, j, len, len1, method, results;
  for (i = 0, len = methods.length; i < len; i++) {
    method = methods[i];
    this[method] = noop;
  }
  results = [];
  for (j = 0, len1 = unformatableMethods.length; j < len1; j++) {
    method = unformatableMethods[j];
    results.push(this[method] = noop);
  }
  return results;
};

_defineMethods = function(style, parentName) {
  var args, i, isExclusive, isntInclusive, j, k, len, len1, len2, method, prop, ref, ref1, results;
  if (!currentConf.enabled) {
    return _disable.bind(this)();
  } else {
    args = argsForBadgee(this.label, style, parentName);
    if (style && args.length > 1) {
      args[0] += '%c';
      args.push('p:a');
    }
    isntInclusive = (filter.include != null) && !filter.include.test(args[0]);
    isExclusive = (ref = filter.exclude) != null ? ref.test(args[0]) : void 0;
    if (isntInclusive || isExclusive) {
      _disable.bind(this)();
    } else {
      for (i = 0, len = methods.length; i < len; i++) {
        method = methods[i];
        this[method] = (ref1 = console[method]).bind.apply(ref1, [console].concat(slice.call(args)));
      }
      for (j = 0, len1 = unformatableMethods.length; j < len1; j++) {
        method = unformatableMethods[j];
        this[method] = console[method].bind(console);
      }
    }
    results = [];
    for (k = 0, len2 = properties.length; k < len2; k++) {
      prop = properties[k];
      results.push(this[prop] = console[prop]);
    }
    return results;
  }
};

Badgee = (function() {
  function Badgee(label1, style, parentName) {
    this.label = label1;
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
  var ref;
  return (ref = store.get(label)) != null ? ref.badgee : void 0;
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
} catch (error) {
  e = error;
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


},{"./config":2,"./store":3,"./styles":4}],2:[function(require,module,exports){
'use strict';
var config, configure, defaults, extend;

extend = require('./utils').extend;

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


},{"./utils":5}],3:[function(require,module,exports){
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
    var name, obj, ref, results;
    ref = this._store;
    results = [];
    for (name in ref) {
      obj = ref[name];
      results.push(name);
    }
    return results;
  };

  Store.prototype.each = function(func) {
    var name, obj, ref, results;
    ref = this._store;
    results = [];
    for (name in ref) {
      obj = ref[name];
      results.push(func(name, obj));
    }
    return results;
  };

  return Store;

})();

module.exports = Store;


},{}],4:[function(require,module,exports){
'use strict';
var Store, black, defaults, extend, store, styles;

Store = require('./store');

extend = require('./utils').extend;

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
      var results;
      results = [];
      for (k in style) {
        v = style[k];
        results.push(style.hasOwnProperty(k) ? k + ":" + v + ";" : void 0);
      }
      return results;
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


},{"./store":3,"./utils":5}],5:[function(require,module,exports){
'use strict';
var extend,
  slice = [].slice;

extend = function() {
  var args, destObj, i, key, len, obj, value;
  destObj = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  for (i = 0, len = args.length; i < len; i++) {
    obj = args[i];
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


},{}]},{},[1])(1)
});
# badgee.js

[![Build Status](https://travis-ci.org/dharFr/badgee.svg?branch=master)](https://travis-ci.org/dharFr/badgee)

A browser console improvement

## What is `badgee`?

It's an add-on to the browser console, created to improve readability and flexibility. It provides the same API than your brower console, adding a few extra features.

## Compatibility

Work pretty well in Chrome, Firefox Web Console or Firebug and Safari desktop.

## Install with Bower

```
bower install badgee
```

## Overview

`badgee` is superset of the 'console' object. You can start using it without configuration as you usually do with 'console' object.

```js
badgee.log('Configuring badgee...');
```

A simple configuration object allows to:
 - enable/disable logs globally
 - enable/disable styled badges globally

Default configuration is: `{ enabled: true, styled: true }`

```js
badgee.config({
  enabled: true,
  styled: false
});
```

Called without any arguments, the `config` method returns the current configuration

```js
badgee.log( 'Config set to:', badgee.config() );
```

The `define()` method creates a new badgee instance identified by the first argument. The second argument points to an already defined style.
The retunred object works the same way as `console` or `badgee` objects, but every console output is prefixed with a "green" styled badge.

```js
var helloBadge = badgee.define('Hello', 'green');
helloBadge.log('hello badge defined!');
```

There is already a few styles defined for your badges.
You can list them all using the `style()` method without any argument.

```js
badgee.log('Default styles for your badgee:', badgee.style());
// Default styles for your badgee: ["green", "purple", "orange", "red", "yellow"]
```

You can define your own badge style by calling the `style()` method with a name and a list of properties.

```js
badgee.style('super_important', {
  color          : 'white',
  background     : 'red',
  'font-size'    : '15px',
  'font-weight'  : 'bold',
  'border-radius': '2px',
  padding        : '1px 3px',
  margin         : '0 1px'
});
```

The style list gets updated after defining a new style.

```js
badgee.log('Added "super_important" style to the list:', badgee.style());
// Added "super_important" style to the list: ["green", "purple", "orange", "red", "yellow", "super_important"]
```

Once a new style is defined, it can be used to define a new badge.

```js
var importantBadge = badgee.define('Important', 'super_important');
importantBadge.log("Don't miss this one!");
```

Somewhere else in your application, you may want to reuse an existing badge. 
Get it back by calling the `get()` method with the badge identifier as a first argument.

```js
var helloBadge = badgee.get('Hello');
helloBadge.log('Using Hello badge from another module' );
```

You can also use the `define()` method on an existing badgee instance to define a nested badge.
The newly defined object is still a `badgee` instance. 
But every console output will be prefixed with two badges instead of one.

```js
var helloWorldBadge = helloBadge.define('world', 'purple');
helloWorldBadge.log('hello world badge defined!');
```

As any badgee instance is a 'console' superset, you can also use any other `console` method, as you used to.

```js
helloBadge.group('Creating a "group"');
  helloBadge.debug('This is a "debug"');
  helloBadge.info('This is a" info"');
  helloWorldBadge.warn('This is a "warn"');
  helloWorldBadge.error('This is an "error"');
helloBadge.groupEnd();
```

Some methods can be prefixed with a badge but are still available for convenience.

```js
helloBadge.groupCollapsed('Creating a "groupCollapsed"');
  helloBadge.assert(false);
  // 'clear()' method is also available but commented for obvious reason
  // helloBadge.clear();
  helloBadge.count('This is a "count"');
  helloBadge.dir({a: 'this is', b: 'a dir'});
  helloBadge.table([{key: 'This is'}, {key: 'a table'}]);
  helloBadge.trace('This is a "trace"');
  helloBadge.time('t');
  helloBadge.timeEnd('t');
helloBadge.groupEnd();
```

## API

### `badgee.config([settings])`

Update the configuration with the provided `settings` object. Or returns the current configuration when called without parameter.

 - `settings` (Optionnal)
   Type: Object
   A set of key/value pairs to configure the badges
   
   - `enabled` (default: `true`)  
     Type: boolean  
     If set to `false`, logs will no longer be displayed to the console. Otherwise logs are displayed as usual

   - `styled` (default: `true`)  
      Type: boolean  
      If set to `false`, label prefixes will be displayed with default output style. Otherwise, label prefixes will be formated as defined by `style` property (see ).

### `badgee.style([name], [style])`

When called without parameters, returns the list of already defined styles.

 - `name`
    Type: String
    The name of the new style to define.
 - `style`
    Type: Object
    A set of key/value pairs to define a CSS style for badges.

### `badgee.define(label, style)`

Creates and returns a new badgee instance, for which every console output will be prefixed with the provided `label`, formated according to provided `style` definition.

 - `label`  
   Type: String  
   The name of the badgee instance
   
 - `style`  
   Type: String  
   The name of an already defined badgee style (see `badgee.style()`)
   

### `badgee.get(label)`

Returns an existing badgee instance, identified by its `label`

 - `label`  
   Type: String  
   The name of the badgee instance

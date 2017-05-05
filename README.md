# badgee.js

[![Greenkeeper badge](https://badges.greenkeeper.io/dharFr/badgee.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/dharFr/badgee.svg?branch=master)](https://travis-ci.org/dharFr/badgee)
[![npm version](https://img.shields.io/npm/v/badgee.svg)](https://www.npmjs.com/package/badgee)
[![Dependency Status](https://david-dm.org/dharFr/badgee.svg)](https://david-dm.org/dharFr/badgee)
[![devDependency Status](https://david-dm.org/dharFr/badgee/dev-status.svg)](https://david-dm.org/dharFr/badgee#info=devDependencies)

A browser console improvement

## What is `badgee`?

It's an add-on to the browser console, created to improve readability and flexibility. 
It provides the same API than your brower console, adding a few extra features.

![overview](http://www.dhar.fr/assets/badgee/complete.png)

## Install with NPM

```
npm install --save badgee
```

## Compatibility

Work pretty well in Chrome, Firefox Web Console or Firebug and Safari desktop.

## Overview

`badgee` is superset of the 'console' object. 
You can start using it without configuration as you usually do with 'console' object.

```js
badgee.log('Configuring badgee...');
```
> ![simple-log](http://www.dhar.fr/assets/badgee/step-1.png)

### Configuration

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
> ![config](http://www.dhar.fr/assets/badgee/step-2.png)

### Defining a new badgee instance

The `define()` method creates a new badgee instance identified by the first argument. The second argument points to an already defined style.
The retunred object works the same way as `console` or `badgee` objects, but every console output is prefixed with a "green" styled badge.

```js
var helloBadge = badgee.define('Hello', 'green');
helloBadge.log('hello badge defined!');
```
> ![define](http://www.dhar.fr/assets/badgee/step-3.png)

### Styling badges

There is already a few styles defined for your badges.
You can list them all using the `style()` method without any argument.

```js
badgee.log('Default styles for your badgee:', badgee.style());
// Default styles for your badgee: ["green", "purple", "orange", "red", "yellow"]
```
> ![styles](http://www.dhar.fr/assets/badgee/step-4.png)

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
> ![style](http://www.dhar.fr/assets/badgee/step-5.png)

Once a new style is defined, it can be used to define a new badge.

```js
var importantBadge = badgee.define('Important', 'super_important');
importantBadge.log("Don't miss this one!");
```
> ![define](http://www.dhar.fr/assets/badgee/step-6.png)

### Reusing badgee instances

Somewhere else in your application, you may want to reuse an existing badge. 
Get it back by calling the `get()` method with the badge identifier as a first argument.

```js
var helloBadge = badgee.get('Hello');
helloBadge.log('Using Hello badge from another module' );
```
> ![get](http://www.dhar.fr/assets/badgee/step-7.png)

### Nested badges

You can also use the `define()` method on an existing badgee instance to define a nested badge.
The newly defined object is still a `badgee` instance. 
But every console output will be prefixed with two badges instead of one.

```js
var helloWorldBadge = helloBadge.define('world', 'purple');
helloWorldBadge.log('hello world badge defined!');
```
> ![define](http://www.dhar.fr/assets/badgee/step-8.png)

As any badgee instance is a 'console' superset, you can also use any other `console` method, as you used to.

```js
helloBadge.group('Creating a "group"');
  helloBadge.debug('This is a "debug"');
  helloBadge.info('This is a" info"');
  helloWorldBadge.warn('This is a "warn"');
  helloWorldBadge.error('This is an "error"');
helloBadge.groupEnd();
```
> ![group](http://www.dhar.fr/assets/badgee/step-9.png)

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

### Filtering

badgee allows you to define inclusive and exclusive filters. Those filters are applied globally to every single defined instance.
Filters are cummulative. You can define both an inclusive and a exclusive filter.

#### Inclusive filter

Defining a global inclusive filter.
Only outputs logs from loggers that match the defined filter.

```js
badgee.filter.include(/hello/i);

helloBadge.log('Filter: matches /hello/i : not filtered');
helloWorldBadge.log('Filter: matches /hello/i : not filtered');
important.log('Filter: matches /hello/i : filtered, won\'t be displayed');
styledBadge.log('Filter: matches /hello/i : filtered, won\'t be displayed');
```

#### Exclusive filter

Defining a global exclusive filter
Output every logs except those from loggers that match the filter.

```js
badgee.filter.exclude(/world/i);

helloBadge.log('Filter: doesn\'t match /world/i : not filtered');
helloWorldBadge.log('Filter: doesn\'t match /world/i : filtered - won\'t be displayed');
```

#### Cleaning filters

Remove already defined filters.

```js
badgee.filter.none();
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
    The name of the new style to define/retrive.
 - `style`
    Type: Object
    A set of key/value pairs to define a CSS style for badges.

### `badgee.defaultStyle([style])`

When called without parameters, returns the current default styles.

 - `style`
    Type: Object
    A set of key/value pairs to apply by defaultwhen defining a new style for badges.
 
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

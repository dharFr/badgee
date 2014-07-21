# badgee.js

browser console improved

## What is `badgee`?

It's an add-on to the browser console, created to improve readability and flexibility. It provides the same API than your brower console, adding the folling features :
 - enabling/disabling logs
 - badged logs : badges are given a name and style

## Compatibility

Work pretty well in Chrome, Firefox Web Console and Firebug. Safari doesn't support styling output...

## Install with Bower
```
bower install badgee
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

###! badgee v1.0.0 - MIT license ###
'use strict'

# For the record, every single console methods and properties
# ["memory", "exception", "debug", "error", "info", "log", "warn", "dir",
# "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile",
# "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd",
# "group", "groupCollapsed", "groupEnd", "clear"]
properties = [
  'memory'
]
methods = [
  'debug', 'dirxml', 'error', 'group',
  'groupCollapsed', 'info', 'log', 'warn'
]
unformatableMethods = [
  'assert', 'clear', 'count', 'dir', 'exception', 'groupEnd', 'markTimeline', 'profile',
  'profileEnd', 'table', 'trace', 'time', 'timeEnd', 'timeStamp', 'timeline',
  'timelineEnd'
]

noop = ->

# Add compat console object if not available
global.console = (global.console or {})

for method in methods.concat unformatableMethods
  (console[method] = noop if not console[method])



config = require './config'
Store  = require './store'
styles = require './styles'

currentConf = config()
store       = new Store

# concat foramted label for badges output
# (i.e. "%cbadge1%cbadge2" with style or "[badge1][badge2] without style")
concatLabelToOutput = (out='', label, hasStyle=no)->
  "#{out}#{if hasStyle then '%c' else '['}#{label}#{unless hasStyle then ']' else ''}"

# Given a label, style and parentName, generate the full list of arguments to
# pass to console method to get a foramted output
argsForBadgee = (label, style, parentName) ->
  args = []

  style = no unless currentConf.styled
  if parentName
    parent = store.get parentName
    args = argsForBadgee(parent.badgee.label, parent.style, parent.parent)

  if label
    args[0] = concatLabelToOutput args[0], label, !!style

  if style
    args.push styles.stringForStyle style

  return args

# Define Badgee methods form console object
# Intended to be called in a 'Badgee' instance context (e.g. with 'bind()')
_defineMethods = (style, parentName) ->

  unless currentConf.enabled
    @[method] = noop for method in methods
    @[method] = noop for method in unformatableMethods
  else
    # get arguments to pass to console object
    args = argsForBadgee @label, style, parentName

    # Reset style for FF :
    # Defining a last style to an unknown property seems to reset to the default
    # behavior on FF
    if style and args.length > 1
      args[0] += '%c'
      args.push 'p:a'

    # Define Badgee 'formatable' methods form console object
    for method in methods
      @[method] = console[method].bind console, args...

    # Define Badgee 'unformatable' methods form console object
    for method in unformatableMethods
      @[method] = console[method].bind console

    # Define Badgee properties from console object
    for prop in properties
      @[prop] = console[prop]

# ==================================

class Badgee

  constructor: (@label, style, parentName) ->
    # Define Badgee methods form console object
    _defineMethods.bind(@, style, parentName)()

    # Store instance for later reference
    store.add @label, {
      badgee: @,
      style: style,
      parent: parentName
    }

  # Defines a new Badgee instance with @ as parent Badge
  define: (label, style) ->
    return new Badgee label, style, @label

# ==================================

# Create public Badgee instance
b = new Badgee

# Augment public instance with utility methods
b.style         = styles.style
b.defaultStyle  = styles.defaults
b.get           = (label) -> store.get(label)?.badgee
b.config        = (conf) ->
  currentConf = config(conf)
  # when conf is updated, redefine every badgee method
  if conf
    store.each (label, b) ->
      _defineMethods.bind(b.badgee, b.style, b.parent)()
  return currentConf

# Some browsers don't allow to use bind on console object anyway
# fallback to default if needed
try
  b.log()
catch e
  fallback = console
  fallback.define = -> console
  fallback.style  = b.style
  b.styleDefaults = b.styleDefaults
  fallback.get    = -> console
  fallback.config = -> b.config
  b = fallback

module.exports = b


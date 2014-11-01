'use strict'

Store  = require './store'
extend = require('./utils').extend

# Create store to save styles
store = new Store

# Default properties for styles
defaults =
  'border-radius': '2px'
  'padding'      : '1px 3px'
  'margin'       : '0 1px'
  'color'        : 'white'

styles =
  # define a new style or list existing ones
  style: (name, style) ->
    if name? and style?
      style = extend {}, defaults, style
      store.add name, style
      return
    else if name?
      store.get name
    else
      store.list()

  defaults: (style) ->
    defaults = style if style?
    defaults

  stringForStyle: (name) ->
    style = store.get name
    (("#{k}:#{v};" if style.hasOwnProperty k) for k, v of style).join ''


# define a few styles

black = 'color': 'black'

styles.style 'black',   extend {}, 'background': 'black'
styles.style 'blue',    extend {}, 'background': 'blue'
styles.style 'brown',   extend {}, 'background': 'brown'
styles.style 'gray',    extend {}, 'background': 'gray'
styles.style 'green',   extend {}, 'background': 'green'
styles.style 'purple',  extend {}, 'background': 'purple'
styles.style 'red',     extend {}, 'background': 'red'
styles.style 'cyan',    extend {}, black, 'background': 'cyan'
styles.style 'magenta', extend {}, black, 'background': 'magenta'
styles.style 'orange',  extend {}, black, 'background': 'orange'
styles.style 'pink',    extend {}, black, 'background': 'pink'
styles.style 'yellow',  extend {}, black, 'background': 'yellow'


module.exports = styles

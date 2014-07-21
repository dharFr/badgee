
Store  = require './store'
extend = require('./utils').extend

# Create store to save styles
store = new Store

styles =
  # define a new style or list existing ones
  style: (name, style) ->

    if name? and style?
      store.add name, style
      return
    else
      return store.list()

  stringForStyle: (name) ->
    style = store.get name
    (("#{k}:#{v};" if style.hasOwnProperty k) for k, v of style).join ''


# define a few styles
defaults =
  'border-radius': '2px'
  'padding'      : '1px 3px'
  'margin'       : '0 1px'

white = 'color': 'white'
black = 'color': 'black'

styles.style 'green',  extend {}, defaults, white, 'background': 'green'
styles.style 'purple', extend {}, defaults, white, 'background': 'purple'
styles.style 'orange', extend {}, defaults, white, 'background': 'orange'
styles.style 'red',    extend {}, defaults, white, 'background': 'red'
styles.style 'yellow', extend {}, defaults, black, 'background': 'yellow'


module.exports = styles
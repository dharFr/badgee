import { each, extend } from './utils';

// Create store to save styles
const store = {};

// Default properties for styles
let defaultsStyle = {
  'border-radius': '2px',
  'padding'      : '1px 3px',
  'margin'       : '0 1px',
  'color'        : 'white'
};

const styles = {
  // define a new style or list existing ones
  style(name, style) {
    if (name != null && style != null) {
      style = extend(defaultsStyle, style);
      store[name] = style;
    }
    else if (name != null) {
      return store[name];
    }
    return Object.keys(store);
  },

  defaults(style) {
    if (style != null) {
      defaultsStyle = style;
    }
    return defaultsStyle;
  },

  stringForStyle(name) {
    const res = []
    each(store[name], (style, k) => {
      res.push(`${k}:${style};`)
    })
    return res.join('');
  }
};


// define a few styles
const empty = {};
const black = {'color': 'black'};

styles.style('green',   extend(empty, {'background': 'green'}));
styles.style('red',     extend(empty, {'background': 'red'}));
styles.style('orange',  extend(black, {'background': 'orange'}));


export default styles;

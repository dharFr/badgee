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

// define a new style or list existing ones
export const styles = (name, style) => {
  if (name != null && style != null) {
    style = extend(defaultsStyle, style);
    store[name] = style;
  }
  else if (name != null) {
    return store[name];
  }
  return Object.keys(store);
}

export const defaultStyle = (style) => {
  if (style != null) {
    defaultsStyle = style;
  }
  return defaultsStyle;
}

export const style2Str = (name) => {
  let res = ''
  each(store[name], (style, k) => {
    res += `${k}:${style};`
  })
  return res
}

// define a few styles
const buildStyle = (base, bkgColor) => extend(base, {'background': bkgColor})

each(['green', 'red'], (color) => {
  styles(color, buildStyle({}, color))
})
styles('orange', buildStyle({'color': 'black'}, 'orange'));

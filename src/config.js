import { extend } from './utils';

// default configuration
const defaults = {
  enabled : true,
  styled  :  true
};

let config = extend({}, defaults);

const configure = function(conf) {
  // update conf
  if (typeof conf === 'object') {
    config = extend({}, defaults, conf);
  }

  // return current conf
  return config;
};

export default configure

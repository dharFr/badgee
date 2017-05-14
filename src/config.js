import { clone, extend } from './utils';

// default configuration
const defaults = {
  enabled : true,
  styled  :  true
};

let config = clone(defaults);

const configure = function(conf) {
  // update conf
  if (conf) {
    config = extend(defaults, conf);
  }

  // return current conf
  return config;
};

// export default configure
export { config, configure }

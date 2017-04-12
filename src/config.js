'use strict'

extend = require('./utils').extend

# default configuration
defaults =
  enabled: yes
  styled:  yes

config = extend {}, defaults

configure = (conf) ->
  # update conf
  if typeof conf is 'object'
    config = extend {}, defaults, conf

  # return current conf
  return config

module.exports = configure

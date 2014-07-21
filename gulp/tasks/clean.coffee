gulp = require 'gulp'
del  = require 'del'

gulp.task 'clean', (cb) ->

  isProd = global.isProd;
  del ["build/badgee#{if isProd then '.min' else ''}.js"], cb


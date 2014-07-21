gulp      = require 'gulp'
webserver = require 'gulp-webserver'
config    = require '../config'

gulp.task 'serve', ->
  gulp.src 'build'
    .pipe webserver
      port      : config.port,
      fallback  : '../test/index.html',
      livereload: true

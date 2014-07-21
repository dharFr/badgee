gulp  = require 'gulp'
mocha = require 'gulp-mocha'

gulp.task 'mocha', ->
  return gulp.src 'test/**/*.spec.coffee', read: false
    .pipe mocha(reporter: 'spec')

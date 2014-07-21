gulp = require 'gulp'

gulp.task 'watch', ['setWatch', 'browserify'], ->
  # Note: The browserify task handles js recompiling with watchify
  # gulp.watch 'test/**/*.coffee', ['mocha']

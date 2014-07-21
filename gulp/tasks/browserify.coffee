### browserify task
---------------
Bundle javascripty things with browserify!

If the watch task is running, this uses watchify instead
of browserify for faster bundling using caching.
###

browserify   = require 'browserify'
watchify     = require 'watchify'
gulp         = require 'gulp'
gulpif       = require 'gulp-if'
source       = require 'vinyl-source-stream'
bundleLogger = require '../util/bundleLogger'
handleErrors = require '../util/handleErrors'


gulp.task 'browserify', ['clean'], ->

  bundleMethod = if global.isWatching then watchify else browserify
  isProduction = global.isProd

  bundler = bundleMethod {
    # Specify the entry point of your app
    entries: ['./src/badgee.coffee'],
    # Add file extentions to make optional in your requires
    extensions: ['.coffee']
  }

  bundle = ->
    # Log when bundling starts
    bundleLogger.start()

    if isProduction
      bundler.transform(global: true, 'uglifyify')

    return bundler
      .bundle
        # debug: true          # Enable source maps!
        standalone: 'badgee' # Export 'badgee' in the global scope
      # Report compile errors
      .on 'error', handleErrors
      # Use vinyl-source-stream to make the
      # stream gulp compatible. Specifiy the
      # desired output filename here.
      .pipe gulpif(not isProduction, source('badgee.js'))
      .pipe gulpif(    isProduction, source('badgee.min.js'))
      # Specify the output destination
      .pipe gulp.dest('./build/')
      # Log when bundling completes!
      .on 'end', bundleLogger.end

  if global.isWatching
    # Rebundle with watchify on changes.
    bundler.on 'update', bundle

  return bundle()

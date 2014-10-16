### browserify task
---------------
Bundle javascripty things with browserify!

If the watch task is running, this uses watchify instead
of browserify for faster bundling using caching.
###

browserify   = require 'browserify'
watchify     = require 'watchify'
gulp         = require 'gulp'
es           = require 'event-stream'
uglify       = require 'gulp-uglify'
streamify    = require 'gulp-streamify'
source       = require 'vinyl-source-stream'
bundleLogger = require '../util/bundleLogger'
handleErrors = require '../util/handleErrors'

gulp.task 'browserify', ['clean'], ->

  bundleMethod = if global.isWatching then watchify else browserify

  bundler = bundleMethod({
    # Specify the entry point of your app
    entries: ['./src/badgee.coffee'],
    # Add file extentions to make optional in your requires
    extensions: ['.coffee']
  })

  bundle = ->
    # Log when bundling starts
    bundleLogger.start()

    normal = bundler.bundle
          debug: false                    # Enable source maps!
          standalone: 'badgee'           # Export 'badgee' in the global scope

        .on('error', handleErrors)       # Report compile errors
        .on('end', bundleLogger.end)     # Log when bundling completes!

        .pipe(source('badgee.js'))       # Use vinyl-source-stream to make the stream gulp compatible. Specifiy the desired output filename here.
        .pipe(gulp.dest('./build/'))     # Specify the output destination

    min = bundler
        # .transform(global: true, 'uglifyify')
        .bundle
          debug: false                    # Enable source maps!
          standalone: 'badgee'           # Export 'badgee' in the global scope

        .on('error', handleErrors)       # Report compile errors
        .on('end', bundleLogger.end)     # Log when bundling completes!
        .pipe(source('badgee.min.js'))   # Use vinyl-source-stream to make the stream gulp compatible. Specifiy the desired output filename here.
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./build/'))     # Specify the output destination

    return es.concat(normal, min)

  if global.isWatching
    # Rebundle with watchify on changes.
    bundler.on 'update', bundle

  return bundle()

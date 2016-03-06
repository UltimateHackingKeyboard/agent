var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    args = require('yargs').argv,
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
  sassAll: 'sass/**/*.scss',
  cssDest: 'css'
}

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
  });

  gulp.watch(['*.html', '*.css', '*.js']).on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src(paths.sassAll)
  .pipe(gulpif(args.debug, sourcemaps.init()))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulpif(args.debug, sourcemaps.write()))
  .pipe(gulp.dest(paths.cssDest));
});

gulp.task('watch', function() {
  gulp.watch(paths.sassAll, ['sass']);
});

gulp.task('default', ['sass']);

var gulp = require('gulp');
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpackStream = require('webpack-stream');

var paths = {
  sassAll: 'sass/**/*.scss',
  cssDest: 'css'
}

gulp.task('sass', function () {
  return gulp.src(paths.sassAll)
    .pipe(gulpif(args.debug, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(args.debug, sourcemaps.write()))
    .pipe(gulp.dest(paths.cssDest));
});

gulp.task('watch', function () {
  gulp.watch(paths.sassAll, ['sass']);
});

gulp.task('webpack', function () {
  return gulp.src('./src/boot.ts')
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['sass', 'webpack']);

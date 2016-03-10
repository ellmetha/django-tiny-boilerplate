import ExtractTextPlugin from 'extract-text-webpack-plugin';
import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import named from 'vinyl-named';
import webpack from 'webpack-stream';

/* Global variables */
var static_dir = '../static/';

/* DIRS */
var build_dir = static_dir + 'build';
var bower_dir = static_dir + '_bower_components';
var sass_dir = static_dir + 'scss';
var js_dir = static_dir + 'js';
var img_dir = static_dir + 'img';
var font_dir = static_dir + 'fonts';

gulp.task('default', ['webpack']);

/* Task to build our CSS applications. */
gulp.task('build-css-applications', function () {
  let extractCSS = new ExtractTextPlugin('[name].css');
  return gulp.src([sass_dir + '/App1.scss', sass_dir + '/App2.scss'])
    .pipe(named())
    .pipe(webpack({
      output: {
        filename: '[name].css',
      },
      resolve: {
        modulesDirectories: ['_bower_components'],
        extensions: ['', 'scss'],
      },
      module: {
        loaders: [
          { test: /\.scss$/i, loader: extractCSS.extract(['css','sass']) },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.txt$/, loader: 'raw-loader' },
          { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000' },
          { test: /\.(eot|ttf|wav|mp3)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ],
      },
      plugins: [ extractCSS ]
    }))
    .pipe(gulp.dest(build_dir + '/css'));
});

/* Task to build our Javascript applications. */
gulp.task('build-js-applications', function() {
  return gulp.src([js_dir + '/App1.js', js_dir + '/App2.js'])
    .pipe(named())
    .pipe(webpack({
      output: {
        filename: '[name].js',
      },
      resolve: {
        modulesDirectories: ['node_modules', '_bower_components'],
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      },
      module: {
        loaders: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ],
      },
    }))
    // .pipe(uglify())
    .pipe(gulp.dest(build_dir + '/js'));
});

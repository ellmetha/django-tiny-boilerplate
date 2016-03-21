import 'babel-polyfill';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import named from 'vinyl-named';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackStream from 'webpack-stream';


/* Global variables */
const PROD_ENV = gutil.env.production;

/* Directories */
var static_dir = '../static/';
var build_dir = PROD_ENV ? static_dir + 'build' : static_dir + 'build_dev';
var bower_dir = static_dir + '_bower_components';
var sass_dir = static_dir + 'scss';
var js_dir = static_dir + 'js';
var img_dir = static_dir + 'img';
var font_dir = static_dir + 'fonts';


/*
 * Global webpack config
 * ~~~~~~~~~~~~~~~~~~~~~
 */

let extractCSS = new ExtractTextPlugin('css/[name].css', { allChunks: true });
var webpackConfig = {
  output: {
    filename: 'js/[name].js',
  },
  resolve: {
    modulesDirectories: ['node_modules', bower_dir],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json', 'scss'],
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/i, loader: extractCSS.extract(['css','sass'], { publicPath: '../'}) },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.txt$/, loader: 'raw-loader' },
      { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?(\?[0-9a-zA-Z]*)?$/, loader: 'url-loader?limit=10000' },
      { test: /\.(eot|ttf|wav|mp3|otf)(\?v=[0-9]\.[0-9]\.[0-9])?(\?[0-9a-zA-Z]*)?$/, loader: 'file-loader' },
    ],
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    'jquery': 'jQuery'
  },
  plugins: [
    extractCSS,
    ...(PROD_ENV ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    ] : []),
  ],
};


/*
 * Webpack task
 * ~~~~~~~~~~~~
 */

/* Task to build our JS and CSS applications. */
gulp.task('build-webpack-assets', function () {
  return gulp.src([
        js_dir + '/App1.js', js_dir + '/App2.js',
        sass_dir + '/App1.scss', sass_dir + '/App2.scss',
      ])
    .pipe(named())
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(build_dir));
});


/*
 * Global tasks
 * ~~~~~~~~~~~~
 */

gulp.task('build', [
  'build-webpack-assets',
  // Add other tasks here if necessary
]);


/*
 * Development tasks
 * ~~~~~~~~~~~~~~~~~
 */

gulp.task('webpack-dev-server', function(callback) {
  var devWebpackConfig = Object.create(webpackConfig);
  devWebpackConfig.devtool = 'eval';
  devWebpackConfig.debug = true;
  devWebpackConfig.devServer = { hot: true };
  devWebpackConfig.entry = {
    App1: [
      js_dir + '/App1.js', sass_dir + '/App1.scss',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
    ],
    App2: [
      js_dir + '/App2.js', sass_dir + '/App2.scss',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
    ],
  };
  devWebpackConfig.module = {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/i, loaders: ['style', 'css', 'sass', ] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.txt$/, loader: 'raw-loader' },
      { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?(\?[0-9a-zA-Z]*)?$/, loader: 'url-loader?limit=10000' },
      { test: /\.(eot|ttf|wav|mp3|otf)(\?v=[0-9]\.[0-9]\.[0-9])?(\?[0-9a-zA-Z]*)?$/, loader: 'file-loader' },
    ],
  };
  devWebpackConfig.output = {
    path: path.resolve(__dirname, static_dir),
    publicPath: 'http://localhost:8080/static/',
    filename: 'js/[name].js'
  };
  devWebpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devWebpackConfig), {
    contentBase: path.resolve(__dirname, static_dir, '..'),
    publicPath: '/static/',
    hot: true,
    inline: true,
  }).listen(8080, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

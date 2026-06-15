// Блок імпорту Gulp-функцій використовується для створення задач автоматизації.
const { src, dest, watch, series, parallel } = require('gulp');

// Блок імпорту плагінів використовується для SCSS, PostCSS, мінімізації та live reload.
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');

// Блок шляхів використовується, щоб не дублювати рядки з адресами файлів у задачах.
const PATH = {
  scssRootFile: './assets/scss/style.scss',
  scssAllFiles: './assets/scss/**/*.scss',
  scssFolder: './assets/scss/',
  cssFolder: './assets/css/',
  htmlAllFiles: './*.html',
  jsAllFiles: './assets/js/**/*.js'
};

// Блок PostCSS-плагінів використовується для сумісності CSS з браузерами та сортування media queries.
const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }),
  mqpacker()
];

// Блок задачі compileScss використовується для компіляції SCSS у читабельний CSS.
function compileScss() {
  return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(csscomb())
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
}

// Блок задачі compileScssMin використовується для створення мінімізованого CSS-файлу.
function compileScssMin() {
  const minifyPlugins = [...PLUGINS, cssnano({ preset: 'default' })];

  return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(minifyPlugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder));
}

// Блок задачі comb використовується для форматування SCSS-файлів у стабільному порядку.
function comb() {
  return src(PATH.scssAllFiles)
    .pipe(csscomb())
    .pipe(dest(PATH.scssFolder));
}

// Блок задачі serve використовується для запуску локального сервера BrowserSync.
function serve(done) {
  browserSync.init({
    server: {
      baseDir: './'
    },
    notify: false,
    open: false
  });

  done();
}

// Блок задачі reload використовується для оновлення браузера після зміни HTML або JS.
function reload(done) {
  browserSync.reload();
  done();
}

// Блок задачі watchFiles використовується для автоматичного стеження за файлами проєкту.
function watchFiles() {
  watch(PATH.scssAllFiles, series(compileScss, compileScssMin));
  watch(PATH.htmlAllFiles, reload);
  watch(PATH.jsAllFiles, reload);
}

// Блок експорту задач використовується для запуску команд через npm scripts.
exports.comb = comb;
exports.scss = series(compileScss, compileScssMin);
exports.min = compileScssMin;
exports.build = series(comb, compileScss, compileScssMin);
exports.dev = series(exports.build, serve, watchFiles);
exports.default = exports.build;

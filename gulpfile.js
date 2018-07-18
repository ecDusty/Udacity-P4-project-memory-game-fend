//Text Variables
var strt = '>---Starting ',
    end = ' Task---<';

//Dependencies Needed
var gulp = require('gulp');
var rename = require('gulp-rename');// not sure I need this
var concat = require('gulp-concat');
var srcMaps = require('gulp-sourcemaps');
var del = require('del');
var zip = require('gulp-zip');

//HTML Dependencies
var htmlMinify = require('gulp-html-minifier');
var plumber = require('gulp-plumber'); //Only good with HTML & CSS files

//Scripts Dependencies
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

//Styles Dependencies
var autoprefixer = require('gulp-autoprefixer');
// var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');

//Image Dependencies
var imgS = require('gulp-image');

//Servers Dependencies
var browserSync = require('browser-sync').create();

/*============
= File Paths =
=============*/


//Source
var SCRIPTS_PATH = 'src/js/{libs,**}/*.js',
    HTML_PATH = 'src/*.html',
    IMG_PATH = 'src/images/*.{png,jpeg,jpg,gif,svg}',
    SCSS_PATH = 'src/scss/*.scss',
    AUD_PATH = 'src/audio/*.mp3';


//Distribution
var DIST_DIR = 'live',
    DIST_CSS = DIST_DIR+'/css',
    DIST_JS = DIST_DIR+'/js',
    DIST_IMG = DIST_DIR+'/images',
    DIST_AUD = DIST_DIR+'/audio';

//Testing
var TEST_DIR = 'test',
    TEST_CSS = TEST_DIR+'/css',
    TEST_JS = TEST_DIR+'/js',
    TEST_IMG = TEST_DIR+'/images/*.{png,jpeg,jpg,gif,svg}',
    TEST_AUD = TEST_DIR+'/audio';

/*============
=   Styles   =
=  for Dist  =
=============*/
gulp.task('sass-dist', function () {
    console.log(strt + 'SASS Styles for DIST' + end);

    return gulp.src(SCSS_PATH)
        .pipe(sass({
            outputStyle: 'compressed'
            }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(DIST_CSS));
});

/*============
=   Styles   =
=  for Dev   =
=============*/
gulp.task('sass-dev', function () {
    console.log(strt + 'SASS Styles for DEV' + end);

    return gulp.src(SCSS_PATH)
        .pipe(srcMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(srcMaps.write())
        .pipe(gulp.dest(TEST_CSS));
});

/*============
=   Scripts  =
=  for Dist  =
=============*/
gulp.task('scripts-dist',['lint-dist'], function () {
    console.log(strt + 'SCRIPTS for DIST' + end);

    return gulp.src(SCRIPTS_PATH)
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_JS));
});

/*============
=   Scripts  =
=   for Dev  =
=============*/
gulp.task('scripts-dev',['lint-dev'], function () {
    console.log(strt + 'SCRIPTS DEV' + end);

    return gulp.src(SCRIPTS_PATH)
        .pipe(srcMaps.init())
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(srcMaps.write())
        .pipe(gulp.dest(TEST_JS));
});

/*============
=    Lint    =
=============*/
gulp.task('lint-dist', function () {
    console.log(strt + 'Linting' + end);
    return gulp.src(SCRIPTS_PATH)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('lint-dev', function () {
    console.log(strt + 'Linting' + end);
    return gulp.src(SCRIPTS_PATH)
        .pipe(eslint({
            "rules": {
            'no-console': 0
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/*============
=    HTML    =
=  for Dist   =
=============*/

gulp.task('html-dist', function () {
    console.log(strt + 'HTML for DIST' + end);

    return gulp.src(HTML_PATH)
        .pipe(plumber(function (err) {
            console.log('---HTML Task Error');
            console.log(err);
            console.log('----Error End');
            this.emit('end');
            }))
        .pipe(htmlMinify({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
            }))
        .pipe(gulp.dest(DIST_DIR));
});

/*============
=    HTML    =
=  for Dev   =
=============*/

gulp.task('html-dev', function () {
    console.log(strt + 'HTML for DEV' + end);

    return gulp.src(HTML_PATH)
        .pipe(plumber(function (err) {
            console.log('---HTML Task Error');
            console.log(err);
            console.log('----Error End');
            this.emit('end');
            }))
        .pipe(htmlMinify({
            collapseWhitespace: true,
            minifyCSS: false,
            minifyJS: false,
            removeComments: true
            }))
        .pipe(gulp.dest(TEST_DIR));
});

/*============
=   IMAGES   =
=  for Dist  =
=============*/

gulp.task('images-dist', function () {
    console.log(strt + 'Images for DIST' + end);

    return gulp.src(IMG_PATH)
        .pipe(imgS())
        .pipe(gulp.dest(DIST_DIR));
});

/*============
=   IMAGES   =
=  for Dev   =
=============*/
gulp.task('images-dev', function () {
    console.log(strt + 'Images for DEV' + end);

    return gulp.src(IMG_PATH)
        .pipe(gulp.dest(TEST_DIR));
});

/*============
=   Server   =
=  for Dist  =
=============*/
gulp.task('serve:dist', function() {

    gulp.watch(SCRIPTS_PATH, ['scripts-dist']);
    gulp.watch(HTML_PATH, ['html-dist']);
    gulp.watch(SCSS_PATH, ['sass-dist']);
    gulp.watch(IMG_PATH, ['images-dist']);

    browserSync.init({
    server: {
        baseDir: './'+DIST_DIR+'/',
        domain: 'local.dev'
    }
    });

    gulp.watch([DIST_DIR+'/{*.html,**/*.html}', DIST_DIR+'/**/*.css', DIST_DIR+'/**/*.js', DIST_DIR+'/**/*.{png,jpeg,jpg,gif,svg}']).on('change', browserSync.reload);
});

/*============
=   Server   =
=  for Dev   =
=============*/
gulp.task('serve:dev', function() {

    gulp.watch(SCRIPTS_PATH, ['scripts-dev']);
    gulp.watch(HTML_PATH, ['html-dev']);
    gulp.watch(SCSS_PATH, ['sass-dev']);
    gulp.watch(IMG_PATH, ['images-dev']);

    browserSync.init({
        server: {
        baseDir: './'+TEST_DIR+'/',
        domain: 'local.dev'
    }
    });

    gulp.watch([TEST_DIR+'/{*.html,**/*.html}', TEST_DIR+'/**/*.css', TEST_DIR+'/**/*.js', TEST_DIR+'/**/*.{png,jpeg,jpg,gif,svg}']).on('change', browserSync.reload);
});

/*============
=   Delete   =
=    Task    =
=============*/
gulp.task('clean', function () {
    return del.sync([
        DIST_DIR+'/**',
        TEST_DIR+'/**'
        ]);
});

/*=====================
=   Create Production =
=      Ready Site     =
=         Task        =
=====================*/
gulp.task('dist', ['html-dist', 'sass-dist', 'scripts-dist', 'images-dist'], function () {
    console.log('>---- Distribution  folder Created ----<');
});

/*=====================
=   Export Production =
=      Ready Site     =
=         Task        =
=====================*/
gulp.task('export', ['html-dist', 'sass-dist', 'scripts-dist', 'images-dist'], function () {
    return gulp.src('{dist/**,src/**,.babelrc,.eslintrc,gulpfile.js,package.json}')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'));
});

/*============
=  Default   =
=  Function  =
=============*/
//This function will clean out your distribution folder, and then update it with all the recent changes. After running this, it's best to run 'gulp serve' to get your live preview playing.
gulp.task('default', [
    'clean',
    'html-dev',
    'sass-dev',
    'scripts-dev',
    'images-dev',
    'serve:dev'
]);

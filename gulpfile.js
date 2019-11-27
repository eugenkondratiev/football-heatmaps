
const c = require('./constants');
const {
    task,
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');
// const gulp = require('gulp');
const sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    // uglify = require('gulp-uglify'),
    uglify = require('gulp-uglify-es').default,
    csso = require('gulp-csso'),
    gulpif = require('gulp-if'),
    cache = require('gulp-cache'),
    // const csso = require('csso');
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    // cssimport = require("gulp-cssimport"),
    autoprefixer = require('gulp-autoprefixer');

console.log(c.DEST_FILES_PATH);

task('clean', () => src(c.DEST_FILES_PATH, { read: false })
    .pipe(clean())
);

task('css', () =>
    src(c.cssfiles)
        // src(c.SRC_PATH + 'stylesheets/hmsheet.css')
        // .pipe(cssimport())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(csso())
        .pipe(concat('hmsheet.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(c.DEST_PATH + 'stylesheets/'))
)

task('scripts', () => src(c.scripts)
    // task('scripts', () => src(c.SRC_PATH + 'javascripts/*')
    .pipe(sourcemaps.init())
    .pipe(concat("hm.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(c.DEST_PATH + 'javascripts/'))

)

task('images', () =>
    src(c.SRC_PATH + 'images/*')
        .pipe(dest(c.DEST_PATH + 'images/'))
)

task('css:watch', () =>
    watch(c.SRC_PATH + 'stylesheets/*.css', series('css'))
);
task('scripts:watch', () =>
    watch(c.SRC_PATH + 'javascripts/*.js', series('scripts'))
);
task('images:watch', () =>
    watch(c.SRC_PATH + 'images/*.*', series('images'))
);

task('default', series('clean',
    parallel(
        series('css', 'css:watch'),
        series('images', 'images:watch'),
        series('scripts', 'scripts:watch')
    )
)
);
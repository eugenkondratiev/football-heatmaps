
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
    browserify = require("browserify"),
    csso = require('gulp-csso'),
    gulpif = require('gulp-if'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    buffer = require("vinyl-buffer"),
    source = require("vinyl-source-stream"),
    babelify = require('babelify'),
    // const csso = require('csso');
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    // cssimport = require("gulp-cssimport"),
    autoprefixer = require('gulp-autoprefixer');

console.log(c.CLEAN_FILES_ARRAY, c.CSS_PATH, c.JS_PATH);

task('clean', () => src(c.CLEAN_FILES_ARRAY, { read: false })
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
        .pipe(dest(c.CSS_DEST_PATH))
)

task('scripts', () =>
    src(c.scripts)
        // task('scripts', () => src(c.SRC_PATH + 'javascripts/*')

        // browserify({
        //     entries: ["!*.min.js"]
        //     // entries: ["./src/js/index.js"]
        // })
        //     .transform(babelify.configure({
        //         presets: ["es2015"]
        //     }))
        //     .bundle()
        //     .pipe(source("hm.js"))
        //     .pipe(buffer())

        // .pipe(gulpif("!*.min.js",babel({
        //     presets: ["@babel/preset-env"
        // //     presets: ['@babel/env'
        //      ]
        // })))


        // .pipe(gulpif("!*.min.js", babel({
        //     presets: [
        //         ["babel-preset-env", { "targets": "> 0.25%, not dead"/*, "useBuiltIns": "entry"*/ }]
        //         // [ "@babel/preset-env", { "targets": "> 0.25%, not dead", "useBuiltIns": "entry" } ]
        //     ],
        //     plugins: [
        //         ["@babel/plugin-proposal-class-properties", { "loose": false }],
        //         ["@babel/plugin-transform-arrow-functions", { "spec": false }],
        //         "@babel/plugin-proposal-export-default-from",
        //         ["@babel/plugin-transform-runtime", { "regenerator": true }]
        //     ]
        //     // ,
        //     // sourceMaps: false,
        // })
        // ))
        .pipe(sourcemaps.init())

        .pipe(concat("hm2.js"))
        // .pipe(gulpif("!*.min.js", uglify()))
        // .pipe(gulpif(uglify())

        .pipe(sourcemaps.write('.'))
        .pipe(dest(c.JS_DEST_PATH))

)
task('es5', function () {
    console.log('es5');
    let production = false
    return (
        browserify({
            entries: [c.JS_DEST_PATH + 'hm2.js'],
        })
            .transform(babelify, { presets: ['@babel/preset-env'] })
            .bundle()
            .pipe(source('hm2.js'))
            // To load existing source maps
            // This will cause sourceMaps to use the previous sourcemap to create an ultimate sourcemap
            // .pipe(rename('hm.js'))
            // .pipe(rename({ extname: '.min.js' }))
            // .pipe(gulpif(production, rename({ extname: '.min.js' })))
            .pipe(buffer())
            .pipe(gulpif(!production, sourcemaps.init({ loadMaps: true })))
            // .pipe(concat('all.js'))
            // .pipe(gulpif(production, uglify()))


            // .pipe(uglify())



            .pipe(src(c.JS_PATH + 'heatmap.js'))
            // .pipe(src(c.JS_PATH + 'heatmap.min.js'))
            .pipe(concat('hm.js'))
            .pipe(gulpif(!production, sourcemaps.write('./')))
            .pipe(dest(c.JS_DEST_PATH))
    );

})

task('images', () =>
    src(c.SRC_PATH + 'images/*')
        .pipe(dest(c.DEST_PATH + 'images/'))
)

task('css:watch', () =>
    watch(c.SRC_PATH + 'stylesheets/*.css', series('css'))
);
task('scripts:watch', () =>
    watch(c.SRC_PATH + 'javascripts/*.js', series('scripts', 'es5'))
);
task('images:watch', () =>
    watch(c.SRC_PATH + 'images/*.*', series('images'))
);

task('default',// series('clean',
    parallel(
        series('css', 'css:watch'),
        series('images', 'images:watch'),
        series('scripts', 'es5', 'scripts:watch')
    )
    // )
);
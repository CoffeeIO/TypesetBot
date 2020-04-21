// Ordered set of TypeScript files to load. -----------------------------------
var source = [
    'src/ts/polyfill.ts',
    'src/ts/main.ts',
    'src/ts/log.ts',
    'src/ts/query.ts',
    'src/ts/settings.ts',
    'src/ts/utils.ts',
    'src/ts/viewport.ts',
    'src/ts/math.ts',
    'src/ts/token.ts',
    'src/ts/typeset.ts',
    'src/ts/render.ts',
    'src/ts/html.ts',
    'src/ts/hyphen.ts',
];
var librarySource = [
    'vendor/Queue.js',
];
// ----------------------------------------------------------------------------

// Initialize gulp variables.
var gulp = require("gulp");
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require("gulp-babel");
var ts = require('gulp-typescript');
var minify = require('gulp-minify');

gulp.task('scss', function () {
    return gulp.src(
        './src/scss/main.scss'
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('typesetbot.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scss-minify', function () {
    return gulp.src(
        './src/scss/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('typesetbot.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('ts-test', function () {
    return gulp.src(source)
        .pipe(ts({
            noImplicitAny: true,
            lib: ['dom', 'es2017', 'es6', 'es5', 'dom.iterable'],
            noLib: false,
            removeComments: false,
            target: 'ES6',
        }))
        .pipe(babel());
});

gulp.task('ts', function () {
    return gulp.src(source)
        .pipe(concat('typesetbot.ts'))
        .pipe(ts({
            noImplicitAny: true,
            lib: ['dom', 'es2017', 'es6', 'es5', 'dom.iterable'],
            noLib: false,
            removeComments: false,
            target: 'ES6',
        }))
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('ts-minify', function () {
    return gulp.src('dist/typesetbot.js')
        .pipe(minify({
            ext:{
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task('vendor', function () {
    return gulp.src(librarySource)
        .pipe(concat('typesetbot-vendor.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task('vendor-minify', function () {
    return gulp.src('dist/typesetbot-vendor.js')
        .pipe(minify({
            ext:{
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task('merge', function () {
    return gulp.src([
            'dist/typesetbot-vendor.js',
            'dist/typesetbot.js',
        ])
        .pipe(concat('typesetbot.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task('merge-minify', function () {
    return gulp.src([
            'dist/typesetbot-vendor.min.js',
            'dist/typesetbot.min.js',
        ])
        .pipe(concat('typesetbot.min.js'))
        .pipe(gulp.dest("dist"));
});

var tasks = [
    'vendor', 'vendor-minify', // Bundle vendor files
    'ts-test',                 // Check if the Typescript can compile
    'ts', 'ts-minify',         // Compile Typescript files
    'merge', 'merge-minify',   // Merge vendor files with typescript files
    'scss', 'scss-minify'      // Compile sass files
];

gulp.task('compile', gulp.series(tasks))
gulp.task('watch-src', function() {
    return watch('src/**/*', gulp.series(tasks));
});
gulp.task('watch', gulp.series('compile', 'watch-src'));
gulp.task("default", gulp.series('compile'));

// Ordered set of TypeScript files to load. -----------------------------------
var source = [
    'src/ts/main.ts',
    'src/ts/log.ts',
    'src/ts/query.ts',
    'src/ts/settings.ts',
    'src/ts/utils.ts',
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

gulp.task('compile', gulp.series('ts-test', 'ts', 'ts-minify', 'scss'))

gulp.task('watch-src', function() {
    return watch('src/**/*', gulp.series('ts-test', 'ts', 'ts-minify', 'scss'));
});

gulp.task('watch', gulp.series('compile', 'watch-src'));

gulp.task("default", gulp.series('compile'));

 

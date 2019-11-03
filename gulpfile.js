var gulp = require("gulp");
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require("gulp-babel");
var ts = require('gulp-typescript');

// Ordered set of TypeScript files to load.
var source = [
    'src/ts/tsb.hyphen.ts',
    'src/ts/tsb.ts'
];

gulp.task('scss', function () {
    return gulp.src(
        './src/scss/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('typesetbot.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('ts', function () {
    return gulp.src(source)
        .pipe(concat('typesetbot.ts'))
        .pipe(ts({
            noImplicitAny: true,
        }))
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('compile', gulp.series('ts', 'scss'))

gulp.task('watch-src', function() {
    return watch('src/**/*', gulp.series('ts', 'scss'));
});

gulp.task('watch', gulp.series('compile', 'watch-src'));

gulp.task("default", gulp.series('compile'));

 

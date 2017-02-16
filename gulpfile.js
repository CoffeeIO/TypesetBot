var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

gulp.task('default', ['sass','uglify'], function () {

});

gulp.task('sass', function () {
    return gulp.src(
        './src/styles/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/scripts/preModule.js',
        'src/scripts/typesetbot.lineUtils.js',
        'src/scripts/typesetbot.wordUtils.js',
        'src/scripts/typesetbot.paraUtils.js',
        'src/scripts/typesetbot.js',
        'src/scripts/postModule.js'
    ])
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

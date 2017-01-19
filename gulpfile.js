var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

gulp.task('default', ['uglify'], function () {

});

gulp.task('uglify', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

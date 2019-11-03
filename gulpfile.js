// var gulp = require('gulp');
// var sass = require('gulp-sass');
// var uglify = require('gulp-uglify');
// var pump = require('pump');
// var concat = require('gulp-concat');
// var watch = require('gulp-watch');
var gulp = require("gulp");
var babel = require("gulp-babel");


// gulp.task('default', ['sass','uglify'], function () {

// });

// var gulp = require("gulp");
// var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("src/main.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

// gulp.task('sass', function () {
//     return gulp.src(
//         './src/styles/main.scss'
//     )
//     .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
//     .pipe(concat('typesetbot.min.css'))
//     .pipe(gulp.dest('dist'));
// });

// var source = [
//     'src/scripts/vendor/typesetbotquery.js',
//     'src/scripts/vendor/Queue.js',
//     'src/scripts/preModule.js',
//     'src/scripts/typesetbot.utils.js',
//     'src/scripts/typesetbot.paraUtils.js',
//     'src/scripts/typesetbot.lineUtils.js',
//     'src/scripts/typesetbot.nodeUtils.js',
//     'src/scripts/typesetbot.node.js',
//     'src/scripts/typesetbot.typesetUtils.js',
//     'src/scripts/typesetbot.typeset.js',
//     'src/scripts/typesetbot.hyphen.js',
//     'src/scripts/typesetbot.render.js',
//     'src/scripts/typesetbot.settings.js',
//     'src/scripts/typesetbot.math.js',
//     'src/scripts/typesetbot.viewport.js',
//     'src/scripts/typesetbot.js',
//     'src/scripts/postModule.js'
// ];
// gulp.task('uglify', function() {
//     return gulp.src(source)
//     .pipe(concat('typesetbot.js'))
//     // .pipe(uglify()) // uglify doesn't support the newest ES6 syntax
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('watch', function() {
//     gulp.run('sass');
//     gulp.run('uglify');
//     return watch('src/**/*', function () {
//         gulp.run('sass');
//         gulp.run('uglify');
//     });
// });

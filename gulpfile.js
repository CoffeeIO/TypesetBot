var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default', ['sass','uglify', 'uglifyLang'], function () {

});

gulp.task('sass', function () {
    return gulp.src(
        './src/styles/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('dist'));
});

var langBase = 'dist/hyphenation-patterns/',
    languages = [
    langBase + 'be.js',
    langBase + 'bn.js',
    langBase + 'ca.js',
    langBase + 'cs.js',
    langBase + 'da.js',
    langBase + 'de.js',
    langBase + 'el-monoton.js',
    langBase + 'el-polyton.js',
    langBase + 'en-gb.js',
    langBase + 'en-us.js',
    langBase + 'es.js',
    langBase + 'fi.js',
    langBase + 'fr.js',
    langBase + 'grc.js',
    langBase + 'gu.js',
    langBase + 'hi.js',
    langBase + 'hu.js',
    langBase + 'hy.js',
    langBase + 'is.js',
    langBase + 'it.js',
    langBase + 'kn.js',
    langBase + 'la.js',
    langBase + 'lt.js',
    langBase + 'lv.js',
    langBase + 'ml.js',
    langBase + 'nb-no.js',
    langBase + 'nl.js',
    langBase + 'or.js',
    langBase + 'pa.js',
    langBase + 'pl.js',
    langBase + 'pt.js',
    langBase + 'ru.js',
    langBase + 'sk.js',
    langBase + 'sl.js',
    langBase + 'sv.js',
    langBase + 'ta.js',
    langBase + 'te.js',
    langBase + 'tr.js',
    langBase + 'uk.js'
];
var source = [
    'node_modules/jquery/dist/jquery.min.js',
    'src/scripts/vendor/hypher.js',
    'src/scripts/vendor/Queue.js',
    'src/scripts/preModule.js',
    'src/scripts/typesetbot.utils.js',
    'src/scripts/typesetbot.paraUtils.js',
    'src/scripts/typesetbot.lineUtils.js',
    'src/scripts/typesetbot.nodeUtils.js',
    'src/scripts/typesetbot.node.js',
    'src/scripts/typesetbot.typesetUtils.js',
    'src/scripts/typesetbot.typeset.js',
    'src/scripts/typesetbot.hyphen.js',
    'src/scripts/typesetbot.render.js',
    'src/scripts/typesetbot.settings.js',
    'src/scripts/typesetbot.math.js',
    'src/scripts/typesetbot.viewport.js',
    'src/scripts/typesetbot.js',
    'src/scripts/postModule.js'
];
gulp.task('uglify', function() {
    return gulp.src(source)
    .pipe(concat('main.min.js'))
    // .pipe(uglify()) // uglify doesn't support the newest ES6 syntax
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.run('sass');
    gulp.run('uglify');
    gulp.run('uglifyLang');
    return watch('src/**/*', function () {
        gulp.run('sass');
        gulp.run('uglify');
        gulp.run('uglifyLang');
    });
});

gulp.task('uglifyLang', function() {
    return gulp.src(source.concat(languages))
    .pipe(concat('mainWithPatterns.min.js'))
    // .pipe(uglify()) // uglify doesn't support the newest ES6 syntax
    .pipe(gulp.dest('dist'));
});

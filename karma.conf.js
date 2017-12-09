// Karma configuration
// Generated on Mon Jul 18 2016 14:06:44 GMT-0500 (Central Daylight Time (Mexico))

module.exports = function(config) {

    var configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser.
        files: [
            // Source files.
            {pattern: 'dist/typesetbot.js', watched: true, included: true, served: true},
            {pattern: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js', watched: true, included: true, served: true},
            {pattern: 'node_modules/hypher/dist/jquery.hypher.js', watched: true, included: true, served: true},
            {pattern: 'node_modules/hyphenation.en-us/lib/en-us.js', watched: true, included: true, served: true},

            {pattern: 'fixtures/**/*.html'},

            // Test files.
            {pattern: 'test/paraUtils.test.js', watched: true, included: true, served: true},
            {pattern: 'test/lineUtils.test.js', watched: true, included: true, served: true},
            {pattern: 'test/nodeUtils.test.js', watched: true, included: true, served: true},
            {pattern: 'test/typesetUtils.test.js', watched: true, included: true, served: true},
            {pattern: 'test/utils.test.js', watched: true, included: true, served: true},
            {pattern: 'test/math.test.js', watched: true, included: true, served: true},
            {pattern: 'test/hyphen.test.js', watched: true, included: true, served: true},
            {pattern: 'test/settings.test.js', watched: true, included: true, served: true},
        ],

        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.html': ['html2js']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        html2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'public/',

            // prepend this to the file path
            prependPrefix: 'served/',

            // or define a custom transform function
            processPath: function(filePath) {
                // Drop the file extension
                return filePath.replace(/\.html$/, '');
            }
        }
    };

    // Change some config (Chrome to Chrome Canary) if Running on TravisCI.
    // See: http://stackoverflow.com/questions/19255976/how-to-make-travis-execute-angular-tests-on-chrome-please-set-env-variable-chr
    if(process.env.TRAVIS){
        configuration.browsers = ['Chrome_travis_ci'];
        configuration.singleRun = true;
    }

    config.set(configuration);
};

// Karma configuration
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
            {pattern: 'dist/typesetbot.css', watched: true, included: true, served: true},

            {pattern: 'https://unpkg.com/@coffeeio/hypher@1.0.0/dist/hypher.js', watched: false, included: true, served: true},
            {pattern: 'https://unpkg.com/@fluid-project/hyphenation-patterns@0.2.2-dev.20181115T211247Z.d313a52/dist/browser/en-us.js', watched: false, included: true, served: true},
            {pattern: 'https://unpkg.com/@fluid-project/hyphenation-patterns@0.2.2-dev.20181115T211247Z.d313a52/dist/browser/en-gb.js', watched: false, included: true, served: true},
            {pattern: 'https://fonts.googleapis.com/css2?family=Open+Sans+Condensed&display=swap', watched: false, included: true, served: true},
            {pattern: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap', watched: false, included: true, served: true},

            // Test files.
            {pattern: 'test/*.test.js', watched: true, included: true, served: true},
        ],

        // plugins: [
        //     // "karma-browserify",
        //     // "karma-chrome-launcher",
        //     // "karma-firefox-launcher",
        //     // "karma-ie-launcher",
        //     // "karma-opera-launcher",
        //     // "karma-phantomjs-launcher"
        // ],
        browsers: [
            "Chrome",
            // "Firefox",
            // "IE",
            //"Opera",
            // "PhantomJS"
        ],

        client: {
            captureConsole: true,
        },

        // list of files to exclude
        exclude: [
        ],

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
        concurrency: Infinity
    };

    // Travis configuration.
    if (process.env.TRAVIS) {
        configuration.customLaunchers = {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        configuration.browsers = [
            "Chrome_travis_ci",
            // "Firefox",
            //"IE",
            //"Opera",
            // "PhantomJS"
        ];
        configuration.singleRun = true;
    }

    config.set(configuration);
};

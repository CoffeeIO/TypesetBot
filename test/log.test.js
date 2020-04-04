'use strict';

describe('log.ts:', function () {
    describe('log --', function() {
        it('No message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['error', 'warn']});

            setTimeout(function() {
                console.log = jasmine.createSpy("log");

                tsb1.logger.log('Hello world');

                expect(console.log).not.toHaveBeenCalled();

                done();
            }, 100);
        });
        it('Message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['log', 'error', 'warn']});

            setTimeout(function() {
                console.log = jasmine.createSpy("log");

                let message = 'Hello world';
                tsb1.logger.log(message);

                expect(console.log).toHaveBeenCalledWith('TypesetBot: %s', message);

                done();
            }, 100);
        });
    });
    describe('warn --', function() {
        it('No message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['error', 'log']});

            setTimeout(function() {
                console.warn = jasmine.createSpy("warn");

                tsb1.logger.warn('Hello world');

                expect(console.warn).not.toHaveBeenCalled();

                done();
            }, 100);
        });
        it('Message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['log', 'error', 'warn']});

            setTimeout(function() {
                console.warn = jasmine.createSpy("warn");

                let message = 'Hello world';
                tsb1.logger.warn(message);

                expect(console.warn).toHaveBeenCalledWith('TypesetBot: %s', message);

                done();
            }, 100);
        });
    });
    describe('error --', function() {
        it('No message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['warn', 'log']});

            setTimeout(function() {
                console.error = jasmine.createSpy("error");

                tsb1.logger.error('Hello world');

                expect(console.error).not.toHaveBeenCalled();

                done();
            }, 100);
        });
        it('Message', function(done) {
            let tsb1 = new TypesetBot(null, { noRun: true, logs:  ['log', 'error', 'warn']});

            setTimeout(function() {
                console.error = jasmine.createSpy("error");

                let message = 'Hello world';
                tsb1.logger.error(message);

                expect(console.error).toHaveBeenCalledWith('TypesetBot: %s', message);

                done();
            }, 100);
        });
    });
});

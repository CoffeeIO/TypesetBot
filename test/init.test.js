'use strict';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

beforeEach(function() {
    // setTimeout(function() {
    //     done();
    // }, 50);
});

afterEach(function() {
    let x = document.body.querySelectorAll('.test, .style');
    for (let y of x) {
        y.remove();
    }
});

describe('Testing Jasmine and browser emulation', function() {

    describe('Basic logic', function() {
        function logMessage() {
            console.log('Hello world');
        }
        function errrMessage() {
            console.error('Hello world');
        }

        it('Basic math', function() {
            let x = 1;
            let y = 4;

            expect(x + y).toEqual(5);
        });
        it('Class exists', function() {
            let tsb = new TypesetBot();

            expect(TypesetBot).not.toEqual(null);
            expect(TypesetBot).not.toEqual(undefined);
        });
        it('Console log spy', function() {
            console.log = jasmine.createSpy("log");
            console.error = jasmine.createSpy("error");

            logMessage();
            expect(console.log).not.toHaveBeenCalledWith('Hello worl');
            expect(console.log).toHaveBeenCalledWith('Hello world');
        });
        it('Console error spy', function() {
            console.error = jasmine.createSpy("error");
            console.log = jasmine.createSpy("log");

            errrMessage();

            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalledWith('Hello worl');
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Hello world');
        });
    });
    describe('Inserting HTML', function() {
        let fixture =
            '<div class="test">' +
                'Hello world' +
            '</div>';

        it('Adding fixture', function() {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');
            expect(t.innerHTML).toEqual('Hello world');
        });

        it('Body is cleared after each test', function() {
            let t = document.querySelector('.test');
            expect(t).toEqual(null);
        });
    });

    describe('Render dimensions', function() {
        let fixture =
            '<div class="test">' +
                'Hello world' +
            '</div>';
        it('Default style properties', function() {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');

            let fontSize = window.getComputedStyle(t).getPropertyValue('font-size');
            expect(fontSize).not.toEqual(null);
            expect(fontSize.indexOf('px')).not.toEqual(-1);
        });
        it('Overwrite style properties', function() {
            let style =
                '<style class="style">' +
                    '.test { font-size: 29px; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');

            let fontSize = window.getComputedStyle(t).getPropertyValue('font-size');
            expect(fontSize).toEqual('29px');
        });
        it('Removing style properties after test', function() {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');

            let fontSize = window.getComputedStyle(t).getPropertyValue('font-size');
            expect(fontSize).not.toEqual('29px');
        });
        it('Getting width of container', function (done) {
            let style =
                '<style class="style">' +
                    '.test { width: 500px; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');
            let widthProp = window.getComputedStyle(t).getPropertyValue('width');
            expect(widthProp).toEqual('500px');

            // Wait a bit for DOM to update.
            setTimeout(function() {
            // return timeout(3000).then(function(r) {
                const rect = t.getBoundingClientRect();
                const width = rect.right - rect.left;
                expect(width).toEqual(500);

                done();
            }, 50);
        });

    });
});


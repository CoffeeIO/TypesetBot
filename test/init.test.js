'use strict';

afterEach(function() {
    let x = document.body.querySelectorAll('.test');
    for (let y of x) {
        y.remove();
    }
});

describe('Setup', function () {

    describe('Basic logic', function () {
        function logMessage() {
            console.log('Hello world');
        }
        function errrMessage() {
            console.error('Hello world');
        }

        it('Basic math', function () {
            let x = 1;
            let y = 4;

            expect(x + y).toEqual(5);
        });
        it('Class exists', function () {
            let tsb = new TypesetBot();

            expect(TypesetBot).not.toEqual(null);
            expect(TypesetBot).not.toEqual(undefined);
        });
        it('Console log spy', function () {
            console.log = jasmine.createSpy("log");
            console.error = jasmine.createSpy("error");

            logMessage();
            expect(console.log).not.toHaveBeenCalledWith('Hello worl');
            expect(console.log).toHaveBeenCalledWith('Hello world');
        });
        it('Console error spy', function () {
            console.error = jasmine.createSpy("error");
            console.log = jasmine.createSpy("log");

            errrMessage();

            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalledWith('Hello worl');
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Hello world');
        });
    });
    describe('Inserting HTML', function () {
        it('Adding fixture', function () {
            let fixture =
                '<div class="test">' +
                    'Hello world' +
                '</div>';

            document.body.innerHTML = document.body.innerHTML + fixture;

            let t = document.querySelector('.test');
            expect(t.innerHTML).toEqual('Hello world');
        });

        it('Body is cleared after each test', function () {
            let t = document.querySelector('.test');
            expect(t).toEqual(null);
        });
    });
});

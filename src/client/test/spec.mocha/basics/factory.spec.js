describe("Basics - factory", function () {
    /*
     * Registers a new test module with global angular, 'app.test'
     * Unlike your production module (e.g., 'app')
     * the 'app.test' module is redefined with each new individual test run
     * Same substance as 'factory-alternative.spec' ... different setup style
     * You'll likely prefer this style.
     */

    var calc,
        service;

    /*** Define service in our imaginary application  ***/

    // "factory" (AKA "service") to test
    function testService() {
        return {
            calc: calc
        };
        ///////////
        function calc(input, previousOutput){
            var inp =  +(input || 0);
            var prev = +(previousOutput || 0);
            return inp + prev;
        }
    }


    /*** Setup module registry ***/

    beforeEach(function () {
        // DO NOT move 'app.test' module definition outside of a `beforeEach`
        // because 'app.test' redefinition elsewhere will wipe it out
        // and some tests, somewhere will break.
        // Can only move it out if NO other test defines an 'app.test' module.
        angular
            .module('app.test', [])  // 'app.test' is a new module that is redefined over and over
            .factory('testService', testService);

        module('app.test');
    });



    /*** Start using the module registry ***/
    // The first `angular.mock.inject` closes module registration and modification

    // Get the service
    beforeEach(inject(function(testService){
        service = testService;
        calc = service.calc; // DRY out the tests
    }));



    /*** Let's test! ***/

    describe("(happy paths)", function () {

        it('calc() => 0', function () {
            expect(calc()).to.equal(0);
        });

        it('calc(1) => 1 ', function () {
            expect(calc(1)).to.equal(1);
        });

        it('calc(1,1) => 2', function () {
            expect(calc(1,1)).to.equal(2);
        });

        it('calc(-1) => -1', function () {
            expect(calc(-1)).to.equal(-1);
        });

        it('calc("0") => 0', function () {
            expect(calc('0')).to.equal(0);
        });

        it('calc("1") => 1', function () {
            expect(calc('1')).to.equal(1);
        });

        it('calc("-1") => -1', function () {
            expect(calc('-1')).to.equal(-1);
        });

        it('calc("") => 0', function () {
            expect(calc('')).to.equal(0);
        });

        it('calc(null) => 0', function () {
            expect(calc()).to.equal(0);
        });

        it('calc(undefined) => 0', function () {
            expect(calc(undefined)).to.equal(0);
        });
    });


    describe("(sad paths)", function () {

        it('calc("not a number") => NaN ', function () {
            expect(isNaN(calc('not a number'))).to.be.true;
        });

        it('calc(1, "not a number") => NaN ', function () {
            expect(isNaN(calc(1, 'not a number'))).to.be.true;
        });
    });

});
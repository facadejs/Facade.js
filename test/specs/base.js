describe('facade.js', function () {

    it('is an function', function () {

        chai.expect(Facade).to.be.an('function');

    });

    it('creates a new object', function () {

        chai.expect(new Facade).to.be.an('object');
        chai.expect(Facade()).to.be.an('object');

    });

});

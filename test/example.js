var assert = require('assert')

//mocha ^3.0.2 breaks the build if no tests are defined
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(4))
    })
  })
})

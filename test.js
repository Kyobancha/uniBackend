var assert = require("chai").assert;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

// assert.typeOf(foo, 'string');
// assert.equal(foo, 'bar');
// assert.lengthOf(foo, 3)
// assert.property(tea, 'flavors');
// assert.lengthOf(tea.flavors, 3);
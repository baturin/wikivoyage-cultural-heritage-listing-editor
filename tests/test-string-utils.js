let assert = require('assert');
let StringUtils = require('../src/lib/string-utils');

describe('StringUtils', function() {
    describe('contains', function() {
        it('should return false if string does not contain substring', function() {
            assert.equal(StringUtils.contains("aaa", "bbb"), false);
        });
        it('should return true if string contains substring', function() {
            assert.equal(StringUtils.contains("abcde", "cd"), true);
        })
    });
});

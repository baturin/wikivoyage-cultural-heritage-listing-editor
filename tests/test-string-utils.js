let assert = require('assert');

import { StringUtils } from '../src/lib/string-utils';

describe('StringUtils', () => {
    describe('contains', () => {
        it('should return false if string does not contain substring', () => {
            assert.equal(StringUtils.contains("aaa", "bbb"), false);
        });
        it('should return true if string contains substring', () => {
            assert.equal(StringUtils.contains("abcde", "cd"), true);
        })
    });
});

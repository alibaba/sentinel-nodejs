'use strict';

const assert = require('assert');
const Util = require('../../../lib/core/log/util');

describe('lib/core/log', () => {
  beforeEach(() => {});

  afterEach(() => {});

  describe('#blockLogFormat', () => {
    it('should format log with increased index', () => {
      const l1 = Util.blockLogFormat('test', 'type', 'app', 'origin', '1');
      const l2 = Util.blockLogFormat('test', 'type', 'app', 'origin', '1');
      const i1 = l1.split('|')[1];
      const i2 = l2.split('|')[1];
      assert.notEqual(l1, l2);
      assert(i1 === '1');
      assert(i2 === '2');
    });
  });
});

'use strict';

const assert = require('assert');
const { wait } = require('../../help');
const TreeStatNode = require('../../../lib/core/node/tree');
const StatisticsNode = require('../../../lib/core/node/statistic');
const EntranceNode = require('../../../lib/core/node/entrance');

describe('lib/core/node', () => {
  beforeEach(() => {});

  afterEach(() => {});

  const logRegExp = /pq\:[0-9.]+\sbq\:[0-9.]+\stq\:[0-9.]+\srt\:[0-9.]+\s1mp\:[0-9.]+\s1mb\:[0-9.]+\s1mt\:[0-9.]+/;

  describe('statistics node', () => {
    const node = new StatisticsNode('id');

    it('should increase total qps count when addTotalRequest() called', async () => {
      assert.equal(node.id, 'id');
      assert.equal(node.resourceName, node.id);
      node.addTotalRequest();
      assert.equal(node.totalQps, 1);

      node.addTotalRequest(2);
      assert.equal(node.totalQps, 3);

      await wait(1000);

      // avg qps of last 2 seconds should be 1.5
      assert.equal(node.totalQpsAvg, 1.5);

      // total qps of 1 min should be 3
      assert.equal(node.totalRequest, 3);
    });

    it('should increase pass qps count when addPassRequest() called', async () => {
      assert.equal(node.id, 'id');

      node.addPassRequest();
      assert.equal(node.passQps, 1);

      node.addPassRequest(2);
      assert.equal(node.passQps, 3);
      await wait(1000);

      // avg qps of last 2 seconds should be 1.5
      assert.equal(node.passQpsAvg, 1.5);

      // total qps of 1 min should be 3
      assert.equal(node.passRequest, 3);
    });

    it('should increase rt and success qps count when addRtAndSuccess() called', async () => {
      assert.equal(node.id, 'id');

      node.addRtAndSuccess(20, 1);
      assert.equal(node.successQps, 1);

      node.addRtAndSuccess(80, 3);
      assert.equal(node.successQps, 4);

      await wait(1000);

      // avg qps of last 2 seconds should be 2
      assert.equal(node.successQpsAvg, 2);

      // arg rt in 2 seconds
      assert.equal(node.avgRt, 25);
    });

    it('should increase blocked qps when increaseBlockedQps() called', async () => {
      node.increaseBlockedQps();
      assert.equal(node.blockedQps, 1);

      node.increaseBlockedQps(2);
      assert.equal(node.blockedQps, 3);

      await wait(1000);

      // avg qps of last 2 seconds should be 1.5
      assert.equal(node.blockedQpsAvg, 1.5);

      // total qps of 1 min should be 3
      assert.equal(node.blockRequest, 3);
    });

    it('should increase exception qps when increaseExceptionQps() called', async () => {
      node.increaseExceptionQps();
      assert.equal(node.exceptionQps, 1);

      node.increaseExceptionQps(2);
      assert.equal(node.exceptionQps, 3);

      await wait(1000);

      // avg qps of last 2 seconds should be 1.5
      assert.equal(node.exceptionQpsAvg, 1.5);

      // total qps of 1 min should be 3
      assert.equal(node.exceptionRequest, 3);
    });


    it('should update threadNum when decreaseConcurrency() and increaseConcurrency() called', async () => {
      assert.equal(node.concurrency, 0);

      node.increaseConcurrency();
      assert.equal(node.concurrency, 1);


      node.decreaseConcurrency();
      assert.equal(node.concurrency, 0);
    });

    it('should return pure json object when toJSON() called', async () => {
      const json = node.toJSON();
      assert.equal(json.resourceName, 'id');
      assert.equal(json.className, 'StatisticsNode');
    });

    it('should return log stringwhen log() called', async () => {
      const log = node.log();
      const str = node.toString();
      assert(log !== '', 'log string should not be empty');
      assert.equal(str, log);
      // should math the format: 
      // pq:passQps bq:blockedQps tq:totalQps rt:averageRt 1mp:1m-passed 1mb:1m-blocked 1mt:1m-total
      assert(logRegExp.test(log), 'in right format');
    });
  });

  describe('statistics node', () => {

    const node = new TreeStatNode('parent');
    const c1 = new StatisticsNode('c1');
    const c2 = new StatisticsNode('c2');

    it('should add child nodes into parant node', async () => {
      
      node.addChild(c1);
      node.addChild(c2);

      assert.equal(node.childNodes.length, 2);
      assert.equal(node.childNodes[0], c1);
      assert.equal(node.childNodes[1], c2);
    });

    it('should return nested string when toString() called', async () => {
      const str = node.toString().trim();
      const strs = str.split('\n');
      assert.equal(strs.length, 3);
      assert(logRegExp.test(strs[0]));
      assert(strs[1].startsWith('-'));
      assert(strs[2].startsWith('-'));
      assert(logRegExp.test(strs[1]));
      assert(logRegExp.test(strs[2]));
    });

    it('should contains child nodes object when toJSON() called', async () => {
      const json = node.toJSON();
      assert.equal(json.childNodes.length, 2);
    });
  });
});

'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Entry = require('../lib/core/entry');
const Sentinel = require('../lib/index');
const { getLogger } = require('../lib/core/log');

const { createClient, addRules } = require('./help');

describe('lib/index', () => {
  let client = null;
  before(async () => {
    client = createClient();
    await client.ready();
    addRules(client);
  });

  after(() => {
    client.close();
    client = null;
    Sentinel.Constants.ROOT.debug();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should sentinel client created', () => {
    assert(client);
  });


  it('should get right statistics if no traffic', () => {
    const node = Sentinel.Constants.ROOT;
    const json = node.toJSON();
    assert(json);
    assert.equal(json.avgRt, 0);
  });

  it('should entry created', () => {
    const name = 'test';
    const e = client.entry(name);
    assert(e);
    assert.equal(e.name, name);
    assert.equal(e.entryType, Entry.EntryType.OUT);
    assert.equal(e.entryType, Entry.EntryType.OUT);
    e.exit();
  });


  it('should pass if qps <= limit', () => {
    const name = 'qps1';
    let entry;
    try {
      entry = client.entry(name, 'IN', 1);
      assert(true, 'should pass');
    } catch (e) {
      assert(false, 'should not throw FlowException');
    } finally {
      entry && entry.exit();
    }
  });


  it('should throw exception if qps > limit', () => {
    const name = 'qps1';
    let entry;
    try {
      entry = client.entry(name, 'IN', 2);
      assert(false, 'should throw exception');
    } catch (e) {
      assert.equal(e.name, 'FlowException');
    } finally {
      entry && entry.exit();
    }
  });

  it('should throw exception if qps > limit', () => {
    const name = 'qps1';
    let entry;
    try {
      entry = client.entry(name, 'IN', 2);
      assert(false, 'should throw exception');
    } catch (e) {
      assert.equal(e.name, 'FlowException');
    } finally {
      entry && entry.exit();
    }
  });

  it('should write block logger when throw block exception', () => {
    const logger = getLogger('blockLogger');
    const log = sinon.stub(logger, 'write');
    const name = 'qps1';
    let entry;
    try {
      entry = client.entry(name, 'IN', 2);
      assert(false, 'should throw exception');
    } catch (e) {
      assert.equal(e.name, 'FlowException');
    } finally {
      entry && entry.exit();
      sinon.assert.calledOnce(log);
    }
  });

  it('should print entry node tree', () => {
    const node = Sentinel.Constants.ROOT;
    assert.equal(node.constructor.name, 'EntranceNode');
    const json = node.toJSON();
    assert(json);
    assert(node.toString());
  });

});

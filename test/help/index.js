'use strict';

const Sentinel = require('../../lib/index');
const FlowRuleManager = require('../../lib/core/flow/rule_manager');

const logger = console;

logger.write = console.log;

exports.createClient = function(options = {}) {
  return new Sentinel(Object.assign({
    appName: 'sentinel-test',
    logger: console,
    blockLogger: console,
  }, options));
};

exports.addRules = function() {
  FlowRuleManager.loadRules([
    { resource: 'qps1', count: '1', metricType: 1 }
  ]);
};

exports.wait = function(millseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, millseconds);
  });
};

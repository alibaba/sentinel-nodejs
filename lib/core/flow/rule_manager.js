'use strict';

const debug = require('debug')('sentinel:flow:rule_manager');
const FlowRule = require('./rule');

let flowRules = new Map(); // list keyed by resourceName

exports.getRulesFor = resourceName => {
  return flowRules.get(resourceName) || [];
};

exports.loadRules = rules => {
  const m = new Map();
  if (rules && Array.isArray(rules)) {
    for (const conf of rules) {
      const rule = new FlowRule(conf);
      const list = m.get(rule.resource) || [];
      list.push(rule);
      m.set(rule.resource, list);
    }
  }

  debug('Flow rules loaded: %o', m);
  flowRules = m;
};

exports.getRules = () => flowRules;

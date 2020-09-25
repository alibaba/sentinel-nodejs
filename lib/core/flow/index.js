const debug = require('debug')('sentinel:flow:flow_slot');
const { FlowException } = require('../exception');
const LinkedProcessorSlot = require('../slots/base');
const ruleManager = require('./rule_manager');

class FlowSlot extends LinkedProcessorSlot {

  checkFlowRules(resourceName, node, acquireCount) {
    const ruleList = ruleManager.getRulesFor(resourceName);
    debug('Checking flow rule for: %s, existing rules: %j', resourceName, ruleList);
    for (let i = 0, len = ruleList.length; i < len; i += 1) {
      const rule = ruleList[i];
      if (!rule.passCheck(node, acquireCount)) {
        throw new FlowException(resourceName, rule);
      }
    }
  }

  entry(payload) {
    const { resourceName, node, count } = payload;
    this.checkFlowRules(resourceName, node, count);

    super.fireEntry(payload);
  }

  exit(payload) {
    super.fireExit(payload);
  }

}

module.exports = FlowSlot;

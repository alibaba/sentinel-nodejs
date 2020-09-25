'use strict';

const { FlowMetricType, FlowRelationStrategy, FlowControlBehavior, FlowConstants } = require('./constants');
const SentinelConfig = require('../config');
const { DefaultQpsController, RateLimiterController, WarmUpController } = require('./controller');

class FlowRule {
  constructor(options) {
    this.resource = options.resource;
    this.limitOrigin = options.limitOrigin || FlowConstants.LIMIT_ORIGIN_DEFAULT;
    this.count = options.count;
    this.metricType = options.metricType || FlowMetricType.QPS;
    this.strategy = options.strategy || FlowRelationStrategy.DIRECT;
    this.warmUpPeriodSec = options.warmUpPeriodSec;
    this.maxQueueingTimeMs = options.maxQueueingTimeMs;
    this.controlBehavior = options.controlBehavior || FlowControlBehavior.REJECT;
    this.controller = this.controller || new DefaultQpsController(this.count);
    switch (this.controlBehavior) {
      case FlowControlBehavior.THROTTLING:
        this.controller = new RateLimiterController(this.count, this.maxQueueingTimeMs);
        break;
      case FlowControlBehavior.WARM_UP:
        this.controller = new WarmUpController(this.count, this.warmUpPeriodSec, SentinelConfig.get('coldFactor'));
        break;
      case FlowControlBehavior.REJECT:
      default:
        this.controller = new DefaultQpsController(this.count);
    }
  }

  passCheck(node, count) {
    return this.controller.canPass(node, count);
  }
}

module.exports = FlowRule;

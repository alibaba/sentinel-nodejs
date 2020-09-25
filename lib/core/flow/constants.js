const FlowMetricType = {
  CONCURRENCY: 0,
  QPS: 1,
};

const FlowRelationStrategy = {
  DIRECT: 0,
  ASSOCIATED_RESOURCE: 1,
  CHAIN: 2,
};

const FlowControlBehavior = {
  REJECT: 0,
  WARM_UP: 1,
  THROTTLING: 2,
  WARM_UP_THROTTLING: 3,
};

Object.freeze(FlowMetricType);
Object.freeze(FlowRelationStrategy);
Object.freeze(FlowControlBehavior);

exports.FlowMetricType = FlowMetricType;
exports.FlowRelationStrategy = FlowRelationStrategy;
exports.FlowControlBehavior = FlowControlBehavior;
exports.FlowConstants = Object.freeze({
  LIMIT_ORIGIN_DEFAULT: 'default',
  LIMIT_ORIGIN_OTHER: 'other',
  DEFAULT_SAMPLE_COUNT: 2,
  DEFAULT_WINDOW_INTERVAL_MS: 1000,
});

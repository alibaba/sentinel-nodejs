'use strict';

class SentinelBlockError extends Error {
  constructor(message, rule) {
    super(message);
    this.name = 'SentinelBlockError';
    this.rule = rule;
  }
}

class FlowException extends SentinelBlockError {
  constructor(message, rule) {
    super(message, rule);
    this.name = 'FlowException';
  }
}

class CircuitBreakerException extends SentinelBlockError {
  constructor(message, rule) {
    super(message, rule);
    this.name = 'CircuitBreakerException';
  }
}

class SystemBlockException extends SentinelBlockError {
  constructor(message, rule) {
    super(message, rule);
    this.name = 'SystemBlockException';
  }
}

exports.SentinelBlockError = SentinelBlockError;
exports.FlowException = FlowException;
exports.CircuitBreakerException = CircuitBreakerException;
exports.SystemBlockException = SystemBlockException;

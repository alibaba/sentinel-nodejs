const Base = require('sdk-base');

const SPH = require('./core');
const Context = require('./core/context');
const { setLoggers } = require('./core/log');
const Constants = require('./core/constants');
const SentinelConfig = require('./core/config');
const { SentinelBlockError, FlowException, CircuitBreakerException, SystemBlockException } = require('./core/exception');

let singleton = null;

class Sentinel extends Base {

  constructor(options) {
    super({
      // initMethod: 'init',
    });
    this.options = options;
    this.appName = options.appName;
    this.sph = new SPH(options);
    setLoggers({
      defaultLogger: options.logger,
      blockLogger: options.blockLogger,
    });
    try {
      if (options.sentinelConfig) {
        for (const key in options.sentinelConfig) {
          if (options.sentinelConfig.hasOwnProperty(key)) {
            SentinelConfig.set(key, options.sentinelConfig[key]);
          }
        }
      }
    } catch (e) {
      (options.logger || console).error('load sentinel config error: ', e);
    }

    if (singleton) {
      throw new Error('Sentinel client should keep in singleton, make sure you have invoke `close()` before destory another one');
    }
    singleton = this;
  }

  close() {
    // TODO: 清理内存，退出
    Context.disableAsyncHook();
    singleton = null;
  }

  entry(resourceName, entryType, count) {
    return this.sph.entry(resourceName, entryType, count);
  }

  get Constants() {
    return Constants;
  }
}

// Expose error
Sentinel.SentinelBlockError = SentinelBlockError;
Sentinel.FlowException = FlowException;
Sentinel.CircuitBreakerException = CircuitBreakerException;
Sentinel.SystemBlockException = SystemBlockException;

// Expose constant
Sentinel.Constants = Constants;

// Expose Context
Sentinel.Context = Context;

module.exports = Sentinel;

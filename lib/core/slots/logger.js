const LinkedProcessorSlot = require('./base');
const { SentinelBlockError } = require('../exception');
const { getLogger } = require('../log');
const LoggerUtil = require('../log/util');

// TODO: eagleeye
class LoggerSlot extends LinkedProcessorSlot {
  entry(payload) {
    try {
      super.fireEntry(payload);
    } catch (e) {
      if (e instanceof SentinelBlockError) {
        const { rule } = e;
        getLogger('blockLogger').write(
          LoggerUtil.blockLogFormat(
            rule.resourceName,
            'FlowException',
            rule.limitOrigin,
            'origin',
            payload.node.blockedQps,
          ),
        );
      }
      throw e;
    }
  }

  exit(payload) {
    super.fireExit(payload);
  }
}

module.exports = LoggerSlot;

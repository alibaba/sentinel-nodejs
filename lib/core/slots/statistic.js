
const debug = require('debug')('sentinel:slots:statistic');
const Entry = require('../entry');
const Constants = require('../constants');
const LinkedProcessorSlot = require('./base');
const { SentinelBlockError } = require('../exception');

class StatisticSlot extends LinkedProcessorSlot {

  entry(payload) {
    const { entryType, node, count } = payload;
    try {
      node.addTotalRequest(count);
      // disable about thread 
      // node.increaseConcurrency();
      super.fireEntry(payload);
      // pass the request
      node.addPassRequest(count);
      if (entryType === Entry.EntryType.IN) {
        // Add count for global inbound entry node for global statistics.
        // Constants.INBOUND_STAT_NODE.increaseConcurrency();
        Constants.INBOUND_STAT_NODE.addPassRequest(count);
      }
      node.debug();
    } catch (err) {
      if (err instanceof SentinelBlockError) {
        node.increaseBlockedQps(count);
        if (entryType === Entry.EntryType.IN) {
          // Add count for global inbound entry node for global statistics.
          Constants.INBOUND_STAT_NODE.increaseBlockedQps(count);
        }
      } else {
        node.increaseExceptionQps();
        if (entryType === Entry.EntryType.IN) {
          // Add count for global inbound entry node for global statistics.
          Constants.INBOUND_STAT_NODE.increaseExceptionQps(count);
        }
      }
      throw err;
    }
  }

  exit(payload) {
    const { entry, node, count } = payload;
    let rt = Date.now() - entry.createTime;
    // Record response time and success count.
    node.addRtAndSuccess(rt, count);
    // disable about thread
    // node.decreaseConcurrency();
    if (entry.entryType === Entry.EntryType.IN) {
      Constants.INBOUND_STAT_NODE.addRtAndSuccess(rt, count);
      // Constants.INBOUND_STAT_NODE.decreaseConcurrency();
    }

    super.fireExit(payload);
  }

}

module.exports = StatisticSlot;

const async_hooks = require('async_hooks');
const debug = require('debug')('sentinel:context:hooks');
const { AsyncTypeFlag } = require('../constants');

/**
 * 性能风险，默认不开启，后续优化提供
 */
module.exports = Context => {
  const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) {
      if (type === AsyncTypeFlag) {
        debug(`current ${asyncId} trigged by ${triggerAsyncId}`);
      }
    },
    before(asyncId) {
      // find parent context before async callback called if exist
      if (Context.exist(asyncId)) {
        debug(`before:  ${asyncId}`);
        const entry = Context.get(asyncId);
        entry.entry();
      }
    },
    after(asyncId) {
      if (Context.exist(asyncId)) {
        debug(`after:  ${asyncId}`);
        const entry = Context.get(asyncId);
        // async callback completed, entry exit.
        entry.exit();
        Context.remove(asyncId);
      }
    },
    destroy(asyncId) {
      if (Context.exist(asyncId)) {
        debug(`destroy:  ${asyncId}`);
      }
    },
  });
  return hook;
};

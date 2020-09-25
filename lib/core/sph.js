const devTool = require('./devtool');
const Context = require('./context');
const Entry = require('./entry');
const { lookProcessChain } = require('./slots');

class SPH {
  constructor(options) {
    this.options = options;
    if (options && options.async) {
      Context.enableAsyncHook();
    }
  }

  entry(resourceName, entryType = Entry.EntryType.OUT, count = 1) {
    if (!Object.values(Entry.EntryType).includes(entryType)) {
      throw new Error(`unknown entry type: ${entryType}`);
    }
  
    const context = Context.getContext();
  
    const chain = lookProcessChain(resourceName);
  
    const entryObj = new Entry(resourceName, entryType, chain, context);
  
    entryObj.entry(count);
    return entryObj;
  }
  
  asyncEntry(resourceName, entryType = Entry.EntryType.OUT, count = 1) {
    return this.entry(resourceName, entryType, count);
  }
}

SPH.devTool = devTool;
module.exports = SPH;


'use strict';

const { AsyncResource, executionAsyncId, triggerAsyncId } = require('async_hooks');
const debug = require('debug')('sentinel:entry');
const Context = require('./context');
const { AsyncTypeFlag } = require('./constants');
const SlotAPI = require('./slots');

class Entry {
  /**
   *
   * @param {string} name resource name
   * @param {string} entryType 'IN': input bound; 'OUT': output bound
   * @param {SlotChain} chain chain of slot
   * @param {Context} context context
   * @param {Entry} parent parent entry
   */
  constructor(name, entryType = Entry.EntryType.OUT, chain, context, parent) {
    this.name = name;
    this.entryType = entryType;
    this.chain = chain;
    this.createTime = Date.now();
    this.context = context || Context.get();
    
    // try to find parent entry
    parent = parent || Context.getParent();
  
    // push this to linked entry chain
    if (parent) {
      parent.child = this;
      this.parent = parent;
    }

    // payload
    this.payload = {
      entry: this,
      context: this.context,
      resourceName: name,
      entryType,
      node: null,
      count: undefined,
    };

    Context.enter(this);
  }

  entry(count) {
    
    this.payload.count = count;
    if (this.chain) {
      this.chain.entry(this.payload);
    }
  }

  runInAsync(name, fn, ...args) {

    const asyncResource = new AsyncResource(
      AsyncTypeFlag, { requireManualDestroy: false }
    );
    const asyncId = asyncResource.asyncId();

    const resourceName = name || this.name; 
    const chain = SlotAPI.lookProcessChain(resourceName);
    const entry = new Entry(resourceName, this.entryType, chain, this.context, this);
    
    debug('create async scope with asyncId: %s, resourceName: %s', asyncId, resourceName);

    // save current context in AsyncContextMap
    Context.set(asyncId, entry);
    return asyncResource.runInAsyncScope(fn, ...args);
  }

  exit(count = 1) {
    Context.exit(this);
    if (!isNaN(count)) {
      this.payload.count = count;
    }

    if (this.chain) {
      this.chain.exit(this.payload);
    }

    if (this.parent) {
      this.parent.child = null;
    }

    // If child entry exist (this may caused by uncaughtd exception), exit recursively.
    let child = this.child;
    while (child) {
      child.exit();
      child = child.child;
    }
    return this;
  }
}

Entry.EntryType = {
  IN: 'IN',
  OUT: 'OUT',
};

module.exports = Entry;

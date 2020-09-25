'use strict';

const debug = require('debug')('sentinel:context');
const { executionAsyncId, triggerAsyncId } = require('async_hooks');
const Constants = require('../constants');
const hooks = require('./hooks');
const EntranceNode = require('../node/entrance');

// async hooks
let hook = null;

// store context in different async scope
const contextNameNodeMap = new Map();

const CONTEXT_NAME = Constants.CONTEXT_DEFAULT_NAME;

const KEY = Symbol.for(CONTEXT_NAME);


const defalutContextNode = new EntranceNode(CONTEXT_NAME);
Constants.ROOT.addChild(defalutContextNode);

// root context
contextNameNodeMap.set(CONTEXT_NAME, defalutContextNode);

class Context {

  static get size() {
    return contextNameNodeMap.size;
  }

  static getContext() {
    if (!Context[KEY]) {
      Context[KEY] = new Context(CONTEXT_NAME, defalutContextNode);
    }
    return Context[KEY];
  }

  static get(key) {
    debug('get entry, key: %s', key);
    return contextNameNodeMap.get(key);
  }

  static set(key = CONTEXT_NAME, node) {
    debug('set entry, key: %s, current size: %s', key, contextNameNodeMap.size);
    if (contextNameNodeMap.size <= Constants.MAX_CONTEXT_NAME_SIZE) {
      contextNameNodeMap.set(key, node);
    }
  }

  static exist(key) {
    return !!contextNameNodeMap.get(key);
  }

  static remove(key) {
    contextNameNodeMap.delete(key);
  }

  static enter(entry) {
    const eid = executionAsyncId();
    debug('enter entry: %s, eid: %s', entry.name, eid);
    entry.eid = eid;
    Context.set(eid, entry);
  }

  static exit(entry) {
    debug('exit entry: %s, eid: %s', entry.name, entry.eid);
    let parent;
    if (entry && entry.parent) {
      parent = entry.parent;
      entry.parent = null;
      parent.child = null;
    }
    if (entry && entry.eid) {
      Context.remove(entry.eid);
    }

    // pop parent entry into current scope
    if (parent && parent.eid === entry.eid) {
      Context.set(parent.eid, parent);
    }
  }

  static getParent() {
    // find parent in current async scope
    const eid = executionAsyncId();
    const parent = Context.get(eid);
    if (parent) {
      return parent;
    }

    // try to find parent in parent async scope
    const pid = triggerAsyncId();
    return Context.get(pid);

  }

  constructor(name = '', entranceNode) {
    this.origin = '';
    this.name = name;
    this.entranceNode = entranceNode;
    this.curEntry = null;
  }

  getLastNode() {
    if (this.curEntry && this.curEntry.curNode) {
      return this.curEntry.curNode;
    }
    return this.entranceNode;
  }

  static enableAsyncHook() {
    if (!hook) {
      hook = hooks(Context);
    }
    hook.enable();
    
  }

  static disableAsyncHook() {
    if (hook) {
      hook.disable();
    }
  }
}


Context.debug = () => {
  debug(contextNameNodeMap);
};


module.exports = Context;

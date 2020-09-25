const TreeStatNode = require('../node/tree');
const LinkedProcessorSlot = require('./base');

class TreeNodeSelectorSlot extends LinkedProcessorSlot {
  constructor() {
    super();
    this.nodeMap = new Map();
  }
  
  entry(payload) {
    const { context, resourceName, entry } = payload;
    let node = this.nodeMap.get(context.name);
    if (!node) {
      node = new TreeStatNode(resourceName);
      const parent = entry.parent;
      if (parent && parent.payload && parent.payload.node) {
        parent.payload.node.addChild(node);
      } else {
        context.getLastNode().addChild(node);
      }
      this.nodeMap.set(context.name, node);
    }
    // save node in payload
    payload.node = node;

    super.fireEntry(payload);
  }

  exit(payload) {
    // do nothing
    super.fireExit(payload);
  }

}

module.exports = TreeNodeSelectorSlot;

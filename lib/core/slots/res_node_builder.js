const ResourceNode = require('../node/resource');
const LinkedProcessorSlot = require('./base');

class ResourceNodeBuilderSlot extends LinkedProcessorSlot {
  constructor() {
    super();
    this.nodeMap = new Map();
    this.resNode = null;
  }

  entry(payload) {
    const { node } = payload;
    if (this.resNode === null) {
      this.resNode = new ResourceNode();
      this.nodeMap.set(node.id, this.resNode);
    }
    node.ResourceNode = this.resNode;

    // TODO: node for context origin
    super.fireEntry(payload);
  }

  exit(payload) {
    // do nothing
    super.fireExit(payload);
  }

}

module.exports = ResourceNodeBuilderSlot;

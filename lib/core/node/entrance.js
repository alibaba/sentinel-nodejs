const TreeStatNode = require('./tree');

class EntranceNode extends TreeStatNode {
  get avgRt() {
    let rt = 0;
    let totalQps = 0;
    for (const node of this.childNodes) {
      rt += node.avgRt * node.passQps;
      totalQps += node.passQps;
    }
    return rt / (totalQps === 0 ? 1 : totalQps);
  }

  get blockedQps() {
    let blockedQps = 0;
    for (const node of this.childNodes) {
      blockedQps += node.blockedQps;
    }
    return blockedQps;
  }

  get blockRequest() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.blockRequest;
    }
    return r;
  }

  get curThreadNum() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.curThreadNum;
    }
    return r;
  }

  get totalQps() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.totalQps;
    }
    return r;
  }

  get successQps() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.successQps;
    }
    return r;
  }

  get passQps() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.passQps;
    }
    return r;
  }

  get totalRequest() {
    let r = 0;
    for (const node of this.childNodes) {
      r += node.totalRequest;
    }
    return r;
  }
}

module.exports = EntranceNode;

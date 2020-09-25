const StatisticsNode = require('./statistic');

class TreeStatNode extends StatisticsNode {
  constructor(id) {
    super(id);
    this.childNodes = [];
  }

  addChild(node) {
    if (!this.childNodes.includes(node)) {
      this.childNodes.push(node);
    }
  }

  toString() {
    return print(this);
  }

  toJSON() {
    const json = super.toJSON();
    json.childNodes = this.childNodes.map(child => child.toJSON());
    return json;
  }
}

function print(root, tab = 0) {
  let str = '';
  const spaces = '-'.repeat(tab);
  const type = root.className;
  str = `${spaces}${type}:${root.resourceName}(${TreeStatNode.prototype.log.call(root)})\n`;
  const childNodes = root.childNodes || [];

  for (const childNode of childNodes) {
    str += print(childNode, tab + 1);
  }
  return str;
}

module.exports = TreeStatNode;

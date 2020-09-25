const debug = require('debug')('sentinel:slots:index');
const SlotChain = require('./chain');
const FlowSlot = require('../flow');
const LoggerSlot = require('./logger');
const TreeNodeSelectorSlot = require('./node_selector');
const ResourceNodeBuilderSlot = require('./res_node_builder');
const StatisticSlot = require('./statistic');

const MAX_SLOT_CHAIN_SIZE = 6000;
let chainMap = new Map();


function buildChain() {
  const chain = new SlotChain();

  chain.addLast(new TreeNodeSelectorSlot());
  chain.addLast(new ResourceNodeBuilderSlot());
  chain.addLast(new LoggerSlot());
  chain.addLast(new StatisticSlot());
  chain.addLast(new FlowSlot());

  return chain;
}

function lookProcessChain(resourceName) {
  let chain = chainMap.get(resourceName);
  if (chain === undefined) {
    if (chainMap.size > MAX_SLOT_CHAIN_SIZE) {
      debug('Resource size exceeds the threshold 6000');
      return null;
    }

    debug('Building slot chain for resource: ', resourceName);
    chain = buildChain();
    chainMap.set(resourceName, chain);
  }

  return chain;
}

function cleanChainMap() {
  chainMap.clear();
  return chainMap;
}

exports.buildChain = buildChain;
exports.lookProcessChain = lookProcessChain;
exports.SlotChain = SlotChain;
exports.cleanChainMap = cleanChainMap;

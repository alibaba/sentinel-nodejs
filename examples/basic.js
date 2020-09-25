
const FlowRuleManager = require('../lib/core/flow/rule_manager');
const Sentinel = require('../lib');

const logger = console;

logger.write = console.log;

const client = new Sentinel({
  appName: 'sentinel-test',
  async: true,
  logger: console,
  blockLogger: console,
});

const Constants = Sentinel.Constants;

function loadFlowRules() {
  FlowRuleManager.loadRules([
    { resource: 'otherStuff', count: '1', metricType: 1 }
  ]);
}

function main() {
  loadFlowRules();

  let entry;
  try {
    entry = client.entry('main');
    otherStuff();
    otherStuff();
  } catch (e) {
    console.error(e);
  } finally {
    if (entry !== null) {
      entry.exit();
    }
    console.log(Constants.ROOT.toString());

    client.close();
  }
}

function otherStuff() {
  let entry;
  try {
    entry = client.entry('otherStuff');
  } catch (e) {
    console.error(e);
  } finally {
    if (entry) {
      entry.exit();
    }
  }
}

main();


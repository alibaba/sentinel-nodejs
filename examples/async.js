const async_hooks = require('async_hooks');
const fs = require('fs');
const devTool = require('../lib/core/devtool');


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


const log = str => fs.writeSync(1, `${str}\n`);

async function main() {
  let entry;
  try {
    entry = client.entry('resourceName1');

    await entry.runInAsync('asyncResourceName1', async () => {
      await sleep(1);
      log('run in asyncResourceName1', async_hooks.executionAsyncId());
    });

    await entry.runInAsync('asyncResourceName2', async () => {
      log('run in asyncResourceName2 ', async_hooks.executionAsyncId());
      const nestedEntry = client.entry('nestedInResourceName2');
      
      nestedEntry.runInAsync('nestedAsync', async () => {
        log('run in nestedAsync');
      }).then(() => {
        nestedEntry.exit();
      });
      await sleep(1);
    });

    const entry2 = client.entry('hello world');
    log('run in asyncResourceName2 hello world');
    entry2.exit();

  } catch (e) {
    console.error(e);
  } finally {
    if (entry) {
      entry.exit();
    }

    console.log(Constants.ROOT.toString());

    // contextNodesMap size should be 1 
    console.log('final contextNodes size', devTool.Context.size);

    client.close();
  }
}

function sleep(n) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

main();


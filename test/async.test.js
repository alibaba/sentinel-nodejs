'use strict';

const assert = require('assert');
const Context = require('../lib/core/context');
const { createClient, addRules } = require('./help');

describe('async.test.js', () => {
  let client = null;
  before(async () => {
    client = createClient({ async: true });
    await client.ready();
    addRules(client);
  });

  after(() => {
    client.close();
    client = null;
  });

  it('should generate nested entries use `runInAsync`', async () => {
    let entry;
    try {
      entry = client.entry('resourceName1');

      await entry.runInAsync('asyncResourceName1', async () => {
        // do something
      });

      await entry.runInAsync('asyncResourceName2', async () => {
        const nestedEntry = client.entry('nestedInResourceName2');
        nestedEntry
          .runInAsync('nestedAsync', async () => {})
          .then(() => {
            nestedEntry.exit();
          });
      });

      const entry2 = client.entry('hello world');
      entry2.exit();
    } catch (e) {
      console.error(e);
    } finally {
      if (entry) {
        entry.exit();
      }
      assert.equal(Context.size, 1);
      const root = entry.payload.node;
      assert(entry.payload.node);
      const childs = entry.payload.node.childNodes;
      console.log(root.toString());
      assert(childs.length === 2);
    }
  });
});

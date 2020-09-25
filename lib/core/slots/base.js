class LinkedProcessorSlot {
  constructor() {
    this.next = null;
  }

  entry(payload) {
    throw new Error('entry method not implemented');
  }

  exit(payload) {
    throw new Error('exit method not implemented');
  }

  fireEntry(payload) {
    if (this.next !== null) {
      this.next.entry(payload);
    }
  }

  fireExit(context, entry, node, count) {
    if (this.next !== null) {
      this.next.exit(context, entry, node, count);
    }
  }
}

module.exports = LinkedProcessorSlot;

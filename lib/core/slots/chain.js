const LinkedProcessorSlot = require('./base');

class FirstSlot extends LinkedProcessorSlot {
  entry(payload) {
    // do nothing but call next
    super.fireEntry(payload);
  }

  exit(payload) {
    // do nothing but call next
    super.fireExit(payload);
  }
}

class SlotChain {
  constructor() {
    this.first = new FirstSlot();
    this.end = this.first;
  }

  addFirst(slot) {
    slot.next = this.first.next;
    this.first.next = slot;
    if (this.first === this.end) {
      this.end = slot;
    }
  }

  addLast(slot) {
    this.end.next = slot;
    this.end = slot;
  }

  entry(payload) {
    this.first.entry(payload);
  }

  exit(payload) {
    this.first.exit(payload);
  }
}

module.exports = SlotChain;

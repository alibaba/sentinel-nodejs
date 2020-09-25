'use strict';

class QPSCounter {
  constructor() {
    this.ts = [[], []];
    this.counts = [[], []];
    this.tmpCounts = [];
    for (let i = 0; i < 60; i += 1) {
      this.counts[0][i] = 0;
      this.ts[0][i] = 0;
      this.counts[1][i] = 0;
      this.ts[1][i] = 0;
      this.tmpCounts[i] = 0;
    }
  }

  _refresh(timestamp) {
    const now = timestamp || Date.now();
    const date = new Date(now);
    const index = date.getMinutes() % 2;
    const second = date.getSeconds();

    if (now - this.ts[index][second] > 2000) {
      this.ts[index][second] = now;
      this.counts[index][second] = 0;
    }

    return {
      now,
      index,
      second,
    };
  }

  plus(count = 1) {
    const { index, second } = this._refresh();

    if (count > 0) {
      this.counts[index][second] += count;
    }

    return this.counts[index][second];
  }

  get(n = 0) {
    const { index, second } = this._refresh(Date.now() - 1000 * n);
    return this.counts[index][second];
  }

  getLastSecond(n = 1) {
    return this.get(1);
  }

  getAvg(n = 1) {
    if (n <= 0) {
      return this.get();
    }

    let total = 0;
    for (let i = 0; i < n; i += 1) {
      total += this.get(1 + i);
    }

    return total / n;
  }

  getMin() {
    return this.getAvg(60) * 60;
  }
}

module.exports = QPSCounter;

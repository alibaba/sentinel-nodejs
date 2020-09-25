'use strict';

class TrafficShapingController {

}

class DefaultQpsController extends TrafficShapingController {
  constructor(count) {
    super();

    this.count = count;
  }

  canPass(node, acquireCount) {
    if (!node) {
      return false;
    }

    return ((node.passQps + acquireCount) <= this.count);
  }
}

class WarmUpController extends TrafficShapingController {
  constructor(count, tokenRate, coldFactor) {
    super();
    this.count = count;
    this.tokenRate = tokenRate;
    this.coldFactor = coldFactor;
  }

  anPass(node, acquireCount) {
    if (!node) {
      return -1;
    }
    if (!node.lastRecordTime) {
      node.lastRecordTime = Date.now();
    }
    const newToken = (Date.now() - node.lastRecordTime) * this.tokenRate;
    const _newToken = newToken > this.fullToken ? this.fullToken : newToken;

    return _newToken - acquireCount >= 0;
  }
}

class RateLimiterController extends TrafficShapingController {

  constructor(count, timeout) {
    super();
    this.count = count;
    this.maxQueueingTimeMs = timeout;
    this.latestPassedTime = -1;
  }

  async canPass(node, acquireCount) {
    if (acquireCount <= 0) {
      return true;
    }
    if (this.count <= 0) {
      return false;
    }
    if (!node) {
      return false;
    }

    const currentTime = Date.now();

    // 本次请求预计消耗时间
    const costTime = Math.round(1.0 * (acquireCount) / this.count * 1000);

    // 漏桶内所有水滴流完所需时刻
    const expectedTime = costTime + this.latestPassedTime;

    // 如果本次请求的时刻比漏桶内所有水滴流完的时刻大，则更新漏桶内水滴流完的时刻，
    // 注意这里使用的是 currentTime 而非 currentTime + costTime，会有些偏差，但影响不大;
    if (expectedTime <= currentTime) {
      this.latestPassedTime = currentTime;
      return true;
    }

    let waitTime = expectedTime - currentTime;
    // wait too long, block it
    if (waitTime > this.maxQueueingTimeMs) {
      return false;
    }
    this.latestPassedTime += costTime;
    const oldTime = this.latestPassedTime;
    try {
      waitTime = oldTime - currentTime;
      if (waitTime > this.maxQueueingTimeMs) {
        this.latestPassedTime -= costTime;
        return false;
      }
      // in race condition waitTime may <= 0
      if (waitTime > 0) {
        await sleep(waitTime);
      }
      return true;
    } catch (e) {
      console.error('wait error: ', e);
    }

    return false;
  }
}

async function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

exports.TrafficShapingController = TrafficShapingController;
exports.WarmUpController = WarmUpController;
exports.DefaultQpsController = DefaultQpsController;
exports.RateLimiterController = RateLimiterController;

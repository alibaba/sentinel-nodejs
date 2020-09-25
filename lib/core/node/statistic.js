const QPSCounter = require('../qps');
const debug = require('debug')('sentinel:node:statistics');

function transformFloat(n) {
  const result = Math.round(n * 100);
  if (result === 0) return 0;
  return result / 100;
}

class StatisticsNode {
  constructor(id) {
    this.id = id;
    this.total = new QPSCounter();
    this.pass = new QPSCounter();
    this.block = new QPSCounter();
    this.exception = new QPSCounter();
    this.rt = new QPSCounter();
    this.success = new QPSCounter();
    this.minRt = new QPSCounter();
    this.concurrency = 0;
  }

  get resourceName() {
    return this.id;
  }

  get className() {
    return this.constructor.name;
  }

  /**
   * @return {number} Incoming request + block request per second.
   */
  get totalQps() {
    return this.total.get();
  }

  get totalQpsAvg() {
    return this.total.getAvg(2);
  }


  /**
   * @return {number} Incoming request per second.
   */
  get passQps() {
    return this.pass.get();
  }

  get passQpsAvg() {
    return this.pass.getAvg(2);
  }


  get exceptionQps() {
    return this.exception.get();
  }

  get exceptionQpsAvg() {
    return this.exception.getAvg(2);
  }


  get exceptionRequest() {
    return this.exception.getMin();
  }

  get successQps() {
    return this.success.get();
  }

  get successQpsAvg() {
    return this.success.getAvg(2);
  }

  /**
   * @return {number} blocked per second.
   */
  get blockedQps() {
    return this.block.get();
  }

  get blockedQpsAvg() {
    return this.block.getAvg(2);
  }

  /**
   * @return {number} Incoming request + block request per minute.
   */
  get totalRequest() {
    return this.total.getMin();
  }

  /**
   * @return {number} Incoming request request per minute.
   */
  get passRequest() {
    return this.pass.getMin();
  }


  /**
   * @return {number} blocked request per minute.
   */
  get blockRequest() {
    return this.block.getMin();
  }

  /**
   * @return {number} Average response per second.
   */
  get avgRt() {
    const successCount = this.success.getAvg(2);
    if (successCount === 0) {
      return 0;
    }
    return this.rt.getAvg(2) / successCount;
  }

  /**
   * Get current active thread count.
   *
   * @return {int} current active thread count
   */
  get curThreadNum() {
    return this.concurrency;
  }

  addTotalRequest(count) {
    this.total.plus(count);
  }

  /**
   * Increase the block count.
   * @param {int} count count to add
   * @return {void}
   */
  addPassRequest(count) {
    this.pass.plus(count);
  }

  /**
   * block count
   * @param {int} count count to add
   * @return {void}
   */
  increaseBlockedQps(count) {
    this.block.plus(count);
  }

  /**
   * exception count
   * @param {int} count count to add
   * @return {void}
   */
  increaseExceptionQps(count) {
    this.exception.plus(count);
  }

  addRtAndSuccess(rt, successCount) {
    this.success.plus(successCount);
    this.rt.plus(rt);
  }


  /**
   * Increase current thread count.
   * @return {int} current active thread count
   */
  increaseConcurrency() {
    return ++this.concurrency;
  }

  /**
   * Decrease current thread count.
   * @return {int} current active thread count
   */
  decreaseConcurrency() {
    return --this.concurrency;
  }

  log() {
    return `pq:${transformFloat(this.passQps)} bq:${transformFloat(this.blockedQps)} tq:${transformFloat(this.totalQps)}` +
    ` rt:${transformFloat(this.avgRt)} 1mp:${transformFloat(this.passRequest)} 1mb:${transformFloat(this.blockRequest)} 1mt:${transformFloat(this.totalRequest)}`;
  }
  /**
   * print debug message
   * pq:passQps bq:blockedQps tq:totalQps rt:averageRt 1mp:1m-passed 1mb:1m-blocked 1mt:1m-total
   */
  debug() {
    debug(this.log());
  }

  toString() {
    return this.log();
  }

  toJSON() {
    return {
      timeStamp: Date.now(),
      resourceName: this.id,
      avgRt: this.avgRt,
      curThreadNum: this.curThreadNum,
      exceptionQps: this.exceptionQpsAvg,
      exceptionRequest: this.exceptionRequest,
      blockedQps: this.blockedQpsAvg,
      blockRequest: this.blockRequest,
      successQps: this.successQpsAvg,
      passQps: this.passQpsAvg, // 每秒成功通过请求
      passRequest: this.passRequest,
      passReqQps: 0, // 每秒到来的请求, 暂无
      totalQps: this.totalQpsAvg, 
      totalRequest: this.totalRequest,
      className: this.className,
    };
  }  
}

module.exports = StatisticsNode;

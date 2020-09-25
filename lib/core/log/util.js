const utility = require('utility');

let lastBlockedSecond;
let lastIndex = 1;

/**
 * 该秒被拦截的资源序号
 * 默认记录上一秒时间戳，若相同，序号递增
 * @param {*} second log time
 */
function getIndex(second) {
  const last = lastBlockedSecond;
  lastBlockedSecond = second;
  if (second !== last) {
    lastIndex = 1;
    return lastIndex;
  }
  lastIndex += 1;
  return lastIndex;
}

// 2014-06-20 16:35:10|1|sayHello(java.lang.String,long),FlowException,default,origin|61,0
// 日志格式: 时间戳|序号(当前秒)|资源名称|拦截的原因|生效规则的调用来源|被拦截资源的调用者|61 被拦截的数量，０则代表可以忽略
exports.blockLogFormat = function blockLogFormat(
  resourceName,
  blockType,
  limitOrigin,
  consumerApp = 'origin',
  blockedQps,
) {
  const second = utility.YYYYMMDDHHmmss();
  const index = getIndex(second);

  return `${second}|${index}|${resourceName},${blockType},${limitOrigin},${consumerApp}|${blockedQps},0`;
};

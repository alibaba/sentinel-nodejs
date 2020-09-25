const SPH = require('./sph');

/**
 *  抛出异常的方式定义资源，示例代码如下:
 *
 *  let entry = null;
 *  // 务必保证finally会被执行
 *  try {
 *    // 资源名可使用任意有业务语义的字符串
 *    entry = sphU.entry('resourceName');
 *    // 被保护的业务逻辑
 *    // do something...
 *  } catch (err) {
 *    // 资源访问阻止，被限流或被降级
 *    // 进行相应的处理操作
 *  } finally {
 *    if (entry !== undefined) {
 *      entry.exit();
 *    }
 *  }
 */

module.exports = SPH;

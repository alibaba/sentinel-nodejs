const Sentinel = require('./lib/index.js');

module.exports = app => {
  const options = app.config.sentinel;

  app.sentinel = new Sentinel(Object.assign({}, options, {
    appName: app.appName,
    logger: app.logger,
  }));
};

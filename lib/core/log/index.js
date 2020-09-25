
const LOGGERS = {};

exports.setLoggers = loggers => {
  Object.assign(LOGGERS, loggers);
};


exports.getLoggers = () => LOGGERS;


exports.getLogger = name => {
  return LOGGERS[name] || LOGGERS.defaultLogger || console;
};

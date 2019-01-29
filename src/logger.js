const Debug = require('debug');

class Logger {
  constructor(tag) {
    this.tag = tag;
    this.infoLog = Debug(`${tag}:info`);
    this.errorLog = Debug(`${tag}:error`);
    this.debugLog = Debug(`${tag}:debug`);

    this.infoLog.enabled = true;
    this.errorLog.enabled = true;
  }

  log(...args) {
    this.infoLog(...args);
  }

  error(...args) {
    this.errorLog(...args);
  }

  debug(...args) {
    this.debugLog(...args);
  }
}

module.exports = Logger;

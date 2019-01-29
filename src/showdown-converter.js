const Showdown = require('showdown');
const Logger = require('./logger');

// todo: find out why extending makeHtml is no good.
class ShowdownConverter extends Showdown.Converter {
  constructor(options) {
    super(options);
    this.log = new Logger('converter');

    this.setFlavor('github');
    this.log.debug('set flavor to GFM');
  }
}

module.exports = ShowdownConverter;

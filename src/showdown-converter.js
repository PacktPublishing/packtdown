const Showdown = require('showdown');

class ShowdownConverter extends Showdown.Converter {
  constructor(options) {
    super(options);

    this.setFlavor('github');
  }
}

module.exports = ShowdownConverter;

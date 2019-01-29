const Showdown = require('showdown');

// todo: wrap output of makeHTML in a template.
class ShowdownConverter extends Showdown.Converter {
  constructor(options) {
    super(options);

    this.setFlavor('github');
  }
}

module.exports = ShowdownConverter;

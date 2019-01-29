// Packtdown
const program = require('commander');

const Packtdown = require('./packtdown.js');
const { version, description } = require('../package.json');

// Set up the program
program
  .version(version, '-v, --version')
  .description(description)
  .option('-d, --directory <directory>', 'The directory to search for MD files')
  .option('-g, --glob <glob>', 'A custom glob for MD files')
  .option('-w, --watch', 'Watch for changes and recompile file');

program.parse(process.argv);

const packtdown = new Packtdown(program);
if(program.watch) {
  packtdown.watch();
} else {
  packtdown.run();
}

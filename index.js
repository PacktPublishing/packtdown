#!/usr/bin/env node

require('colors');

const Debug = require('debug');
const program = require('commander');
const { version, description } = require('./package.json');

// Set up Debug
const log = Debug('packtdown:info');
const error = Debug('packtdown:error');
const debug = Debug('packtdown:debug');
// Force enable logging at info level for the CLI tool.
log.enabled = true;
error.enabled = true;

// log(`packtdown ${version}`.cyan);
debug('Debugging enabled');

// Set up the program
program
  .version(version, '-v, --version')
  .description(description)
  .option('-d, --directory <directory>', 'The directory to search for MD files')
  .option('-g, --glob <glob>', 'A custom glob for MD files');

program.parse(process.argv);

let glob = './docs/**/*.md'; // default glob

if (program.glob) {
  // Set the glob
  debug('Glob Set to', program.glob);

  // eslint-disable-next-line prefer-destructuring
  glob = program.glob;
} else if (program.directory) {
  debug('Directory set to', program.directory);
  // Parse the directory into a glob
  glob = `./${program.directory}/**/*.md`;
}

debug('Parsing files in', glob);

// Run Showdown on each file in the Docs folder and output it
// todo: directory to output? if default is no good.

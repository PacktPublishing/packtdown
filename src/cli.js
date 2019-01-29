// Packtdown
require('colors');

const Debug = require('debug');
const program = require('commander');
const glob = require('glob');
const fs = require('fs-extra');
const showdown  = require('showdown');
const watch = require('glob-watcher');

const { version, description } = require('../package.json');

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
  .option('-g, --glob <glob>', 'A custom glob for MD files')
  .option('-w, --watch', 'Watch for changes and recompile file');

program.parse(process.argv);

let mdGlob = './docs/**/*.md'; // default glob

if (program.glob) {
  // Set the glob
  debug('Glob Set to', program.glob);

  // eslint-disable-next-line prefer-destructuring
  mdGlob = program.glob;
} else if (program.directory) {
  debug('Directory set to', program.directory);
  // Parse the directory into a glob
  mdGlob = `./${program.directory}/**/*.md`;
}

debug('Parsing files in', mdGlob);

// Run Showdown on each file in the Docs folder and output it
// todo: directory to output? if default is no good.
const promiseGlob = (globToProcess) => new Promise((res, rej) => {
    glob(globToProcess, (err, files) => {
      if(err) return rej(err);

      return res(files);
    })
  });

const processFile = (file) => {
    // Spawn tagged logs because this is a fan-out.
    const fileLog = Debug(file);
    const fileLogDetailed = Debug(`${file}:DEBUG`);
    fileLog.enabled = true;

    fileLog('Started');

    const converter = new showdown.Converter();
    return fs.readFile(file)
      .then((buffer) => {
        const text = buffer.toString();

        fileLogDetailed('Read File:', text);

        const html = converter.makeHtml(text);
        fileLogDetailed('Converted to HTML', html);

        const newFileName = file.replace(/md$/, 'html');

        fileLog('Outputting to ', newFileName);

        return fs.outputFile(newFileName, html)
        .then(() => {
          fileLog('Done!');

          return newFileName;
        });
      });
  };

const processFiles = (files) => {
  debug('Processing Files:', files);
  const promises = [];
  for(let f = 0; f < files.length; f += 1) {
    const file = files[f];

    debug('Processing: ', file);

    promises.push(processFile(file));
  }
  return Promise.all(promises);
};

// Process the glob and markdown convert each of the files.
promiseGlob(mdGlob)
  .then(processFiles)
  .then(() => {
    log('Done')
  })
  .catch((err) => {
    error(err);
  });

// if watch
if(program.watch) {
  const watcher = watch(mdGlob);

  watcher.on('change', processFile);
  watcher.on('add', processFile);

  log(`Watching ${mdGlob} for changes`);
}

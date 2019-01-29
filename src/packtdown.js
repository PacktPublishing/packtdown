const fs = require('fs-extra');
const watch = require('glob-watcher');

const Converter = require('./showdown-converter');
const Logger = require('./logger');
const glob = require('./promise-glob');

class Packtdown {
  constructor(options) {
    this.log = new Logger('packtdown');

    this.log.debug('directory: ', options.directory);
    this.log.debug('glob: ', options.glob);

    this.glob = './docs/**/*.md'; // default glob

    if (options.glob) {
      // Set the glob
      this.log.debug('Glob Set to', options.glob);

      this.glob = options.glob;
    } else if (options.directory) {
      this.log.debug('Directory set to', options.directory);
      // Parse the directory into a glob
      this.glob = `./${options.directory}/**/*.md`;
    }

    this.log.debug('Parsing files in', this.glob);
  }

  async run() {
    // Process the glob and markdown convert each of the files.
    try {
      const files = await glob(this.glob);

      await this.processFiles(files);

      this.log.log('Done');
    } catch (error) {
      this.log.error('Error processing files', error.message);
      this.log.error(error);
    }
  }

  async watch() {
    try {
      await this.run();

      const watcher = watch(this.glob);

      watcher.on('change', Packtdown.processFile);
      watcher.on('add', Packtdown.processFile);

      this.log.log(`Watching ${this.glob} for changes`);
    } catch (error) {
      this.log.error('Error watching files', error.message);
      this.log.error(error);
    }
  }

  async processFiles(files) {
    this.log.log('Processing files');
    this.log.debug(files);

    return Promise.all(files.map(async file => Packtdown.processFile(file)));
  }

  static async processFile(file) {
    // Spawn tagged logs because this is a fan-out.
    const log = new Logger(file);
    log.log('Processing');

    try {
      const converter = new Converter();

      const fileBuffer = await fs.readFile(file);
      const fileContents = fileBuffer.toString();

      log.log('Read file contents');
      log.debug(fileContents);

      const html = converter.makeHtml(fileContents);

      log.log('Converted to HTML');
      log.debug(html);

      const newFileName = file.replace(/md$/, 'html');

      log.log('Outputting to', newFileName);

      await fs.outputFile(newFileName, html);
      log.log('Done');
    } catch (error) {
      log.error('Error Processing file', error.message);
      log.error(error);
    }
  }
}

module.exports = Packtdown;

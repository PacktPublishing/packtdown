#!/usr/bin/env node

require('colors');

const Debug = require('debug');
const { version } = require('./package.json');

const log = Debug('packtdown:info');
const error = Debug('packtdown:error');
const debug = Debug('packtdown:debug');
// Force enable logging at info level for the CLI tool.
log.enabled = true;
error.enabled = true;

log(`packtdown ${version}`.cyan);
debug('Debugging enabled');

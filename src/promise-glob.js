const glob = require('glob');

const promiseGlob = globToProcess =>
  new Promise((res, rej) => {
    glob(globToProcess, (err, files) => {
      if (err) return rej(err);

      return res(files);
    });
  });

module.exports = promiseGlob;

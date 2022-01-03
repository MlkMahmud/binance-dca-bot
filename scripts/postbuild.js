const { resolve } = require('path');
const sh = require('shelljs');
const { name, version } = require('../package.json');

if (process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN) {
  const cliPath = resolve('./node_modules/.bin/sentry-cli');
  const release = `${name}@${version}`;
  sh.exec(`${cliPath} releases new ${release}`);
  sh.exec(
    `${cliPath} releases files ${release} upload-sourcemaps ./.next ./dist`
  );
  sh.exec(`${cliPath} releases finalize ${release}`);
}
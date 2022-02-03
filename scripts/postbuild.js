const { resolve } = require('path');
const sh = require('shelljs');

const version = process.env.SENTRY_RELEASE
  ? process.env.SENTRY_RELEASE.trim()
  : 'current';

if (process.env.SENTRY_ENABLED === 'true') {
  const cliPath = resolve('./node_modules/.bin/sentry-cli');
  const release = `binance-dca-bot@${version}`;
  sh.exec(`${cliPath} releases new ${release}`);
  sh.exec(`${cliPath} releases files ${release} delete --all`);
  sh.exec(
    `${cliPath} releases files ${release} upload-sourcemaps ./.next ./dist`
  );
  sh.exec(`${cliPath} releases finalize ${release}`);
}

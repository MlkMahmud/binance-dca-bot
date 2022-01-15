import * as sentry from '@sentry/node';

const version = process.env.SENTRY_RELEASE
  ? process.env.SENTRY_RELEASE.trim()
  : 'current';

sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_ENABLED === 'true',
  release: `binance-dca-bot@${version}`,
});

export default sentry;

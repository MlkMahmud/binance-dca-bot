import * as sentry from '@sentry/node';

const version = process.env.PROJECT_VERSION
  ? process.env.PROJECT_VERSION.trim()
  : 'current';

sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_ENABLED === 'true',
  release: `binance-dca-bot@${version}`,
});

export default sentry;

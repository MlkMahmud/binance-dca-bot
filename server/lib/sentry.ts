import * as sentry from '@sentry/node';

sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: (process.env.SENTRY_ENABLED === 'true'),
});

export default sentry;

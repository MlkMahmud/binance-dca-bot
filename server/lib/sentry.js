import * as sentry from '@sentry/node';

sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_DSN && (process.env.NODE_ENV === 'production'),
});

export default sentry;

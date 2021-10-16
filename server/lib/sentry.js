import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_DSN && (process.env.NODE_ENV === 'production'),
});

export default Sentry;

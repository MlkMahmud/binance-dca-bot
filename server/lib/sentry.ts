import * as sentry from '@sentry/node';
import packageJson from '../../package.json';

const { name } = packageJson;

sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.SENTRY_ENABLED === 'true',
  release: `${name}@current`,
});

export default sentry;

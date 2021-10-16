import next from 'next';
import path from 'path';
import app from './app';
import logger from './lib/logger';
import Sentry from './lib/sentry';

const port = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev, dir: path.dirname(__dirname) });
const handler = nextApp.getRequestHandler();
const appLogger = logger.child({ module: 'app' });

(async function start() {
  try {
    await nextApp.prepare();
    app.all('*', (req, res) => handler(req, res));
    app.use(Sentry.Handlers.errorHandler());
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, nextFunc) => {
      appLogger.error({ err, req });
      res.status(err.status || 500);
      res.end();
      nextFunc();
    });
    app.listen(port, () => {
      appLogger.info(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    appLogger.error({ err });
    process.exit(1);
  }
}());

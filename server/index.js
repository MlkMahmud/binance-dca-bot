import next from 'next';
import path from 'path';
import app from './app';
import Sentry from './lib/sentry';

const port = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev, dir: path.dirname(__dirname) });
const handler = nextApp.getRequestHandler();

(async function start() {
  try {
    await nextApp.prepare();
    app.all('*', (req, res) => handler(req, res));
    app.use(Sentry.Handlers.errorHandler());
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, _) => {
      // log error here for non sentry users
      res.status(err.status || 500);
      res.end();
    });
    app.listen(port, () => {
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}());

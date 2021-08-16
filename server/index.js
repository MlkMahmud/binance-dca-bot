import next from 'next';
import path from 'path';
import app from './app';

const port = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV === 'development';
const server = next({ dev, dir: path.dirname(__dirname) });
const handler = server.getRequestHandler();

(async function () {
  try {
    await server.prepare();

    app
      .all('*', (req, res) => {
        handler(req, res);
      })
      .listen(port, () => {
        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
      });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}());

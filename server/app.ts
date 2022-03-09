import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import sentry from './lib/sentry';
import router from './routes';
import authenticateRequest from './middleware';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(sentry.Handlers.requestHandler());
  app.use(helmet());
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateRequest);
app.use(router);

export default app;

import express from 'express';
import helmet from 'helmet';
import baseRouter from './routes/baseRouter';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(baseRouter);

export default app;

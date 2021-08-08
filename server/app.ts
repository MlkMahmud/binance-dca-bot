import express from 'express';
import helmet from 'helmet';

const app = express();
app.use(express.json());
app.use(helmet());

export default app;

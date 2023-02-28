import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { knowledgesRouter } from './routers/knowledges.router.js';

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/knowledges', knowledgesRouter);

app.use('*', (_req, resp, next) => {
  resp
    .status(404)
    .send(
      `<h1>Sorry, the path is not valid. Did you mean "http://localhost:5500/knowledges/"?<h1>`
    );
  next();
});

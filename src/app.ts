import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { knowledgesRouter } from './routers/knowledges.router.js';

import createDebug from 'debug';
import { CustomError } from './errors/errors.js';
const debug = createDebug('W7CH2:app');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/knowledges', knowledgesRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Challenge 02 - Week 07',
    endpoints: {
      things: '/knowledges',
    },
  });
});

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';

    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);

app.use('*', (_req, resp, next) => {
  resp
    .status(404)
    .send(
      `<h1>Sorry, the path is not valid. Did you mean "http://localhost:5500/knowledges/"?<h1>`
    );
  next();
});

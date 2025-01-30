import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Configuration } from './config';
import apiRouter from './routing';

const createApp = (config: Configuration) => {
  const app = express();

  app.use(cors());
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          // don't compress responses with this request header
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          ...config.helmet.cspDirectives,
        },
      },
    })
  );

  app.use(bodyParser.json(config.bodyParser.json));

  app.use(morgan(config.morgan.format));

  app.use(express.static(path.resolve(__dirname, config.client.root)));

  app.use('/api', apiRouter(config));

  app.use((_, res) => {
    res.sendFile(path.resolve(__dirname, config.client.root, 'index.html'));
  });

  return app;
};

export default createApp;

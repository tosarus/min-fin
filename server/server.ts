import http from 'http';
import createApp from './app';
import createConfig from './config';
import createDb from './dao';

const config = createConfig();
const app = createApp(config);

createDb(config)
  .then((db) => {
    http.createServer(app).listen(config.server.port, () => {
      console.log(
        'Running at http://localhost:%d in %s mode. Connected to db with %s listeners.',
        config.server.port,
        config.isProd ? 'prod' : 'dev',
        db.getMaxListeners()
      );
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

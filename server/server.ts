import http from 'http';
import createApp from './app';
import createConfig from './config';
import createDb from './dao';

const config = createConfig();
const app = createApp(config);

createDb(config)
  .then((info) => {
    http.createServer(app).listen(config.server.port, () => {
      console.log(
        'Running at http://localhost:%d in %s mode. Connected to %s',
        config.server.port,
        config.isProd ? 'prod' : 'dev',
        info
      );
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

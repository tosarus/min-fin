import http from 'http';
import createApp from './app';
import createConfig from './config';
import createDb from './database';

const config = createConfig();

const shutdownWithMessage = (signal: any) => (err: any) => {
  console.log(`${signal}...`);
  if (err) {
    console.error(err.stack || err);
  }
  process.exit(err ? 1 : 0);
};

process
  .on('SIGTERM', shutdownWithMessage('SIGTERM'))
  .on('SIGINT', shutdownWithMessage('SIGINT'))
  .on('uncaughtException', shutdownWithMessage('uncaughtException'));

createDb(config).then((info) => {
  const app = createApp(config);
  http.createServer(app).listen(config.server.port, () => {
    console.log(
      'Running at http://localhost:%d in %s mode. Connected to %s',
      config.server.port,
      config.isProd ? 'prod' : 'dev',
      info
    );
  });
});

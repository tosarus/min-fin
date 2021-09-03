import http from 'http';
import createApp from './app';
import createConfig from './config';

const config = createConfig();
const app = createApp(config);

http.createServer(app).listen(config.server.port, () => {
  console.log('Running at http://localhost:%d in %s mode', config.server.port, config.isProd ? 'prod' : 'dev');
});

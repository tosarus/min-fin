import { config as dotenvConfig } from 'dotenv';
import { AuthConfig } from './auth';

export type Configuration = {
  isProd: boolean;
  admins: string[];
  auth: AuthConfig;
  client: {
    root: string;
  };
  server: {
    port: number;
  };
  morgan: {
    format: string;
  };
  helmet: {
    cspDirectives: { [x: string]: any };
  };
  bodyParser: {
    json: { [x: string]: any };
  };
  pg: {
    database: string;
  };
  delay: {
    ms: number | undefined;
  };
};

const createConfig = (): Configuration => {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    dotenvConfig();
  }

  // server
  const args = process.argv.slice(2);
  const port = Number.parseInt(process.env.PORT || (args.length > 0 ? args[0] : '3000'));
  const delayMs = args.length > 1 ? +args[1] : undefined;

  // express morgan
  const morganFormat = isProd ? 'tiny' : 'dev';

  // Auth configuration
  const authDomain = process.env.AUTH0_DOMAIN || '';
  const authAudience = process.env.AUTH0_AUDIENCE || '';

  // admin list
  const adminList = (process.env.ADMIN_INIT_LIST || '').split(';');

  // web client root
  const clientRoot = '../build';

  // express helmet
  const helmetCspDirectives = {
    'connect-src': ["'self'", authDomain],
    'child-src': [authDomain],
    'img-src': ['*'],
  };

  // express body parser
  const bodyParserJson = {
    type: ['application/*+json', 'application/csp-report'],
  };

  // postgres
  const pgDatabase = process.env.DATABASE_URL || '';

  return {
    isProd,
    admins: adminList,
    auth: { audience: authAudience, domain: authDomain },
    client: { root: clientRoot },
    server: { port },
    morgan: { format: morganFormat },
    helmet: { cspDirectives: helmetCspDirectives },
    bodyParser: { json: bodyParserJson },
    pg: { database: pgDatabase },
    delay: { ms: delayMs },
  };
};

export default createConfig;

import path from 'path';
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
    ssl: boolean;
  };
  migrations: {
    table: string;
    folder: string;
  };
  rateLimit: {
    windowMs: number;
    limit: number;
    [x: string]: any;
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
    type: ['application/json', 'application/csp-report'],
    limit: '5mb',
  };

  // postgres
  const pgDatabase = process.env.DATABASE_URL || '';
  const pgSsl = isProd || process.env.DATABASE_SSL === '1';

  const migrationsTable = 'pgmigrations';
  const migrationsFolder = path.resolve(__dirname, 'database/migrations');

  const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
  const rateLimitLimit = 100; // 100 requests per windowMs

  return {
    isProd,
    admins: adminList,
    auth: { audience: authAudience, domain: authDomain },
    client: { root: clientRoot },
    server: { port },
    morgan: { format: morganFormat },
    helmet: { cspDirectives: helmetCspDirectives },
    bodyParser: { json: bodyParserJson },
    pg: { database: pgDatabase, ssl: pgSsl },
    migrations: { table: migrationsTable, folder: migrationsFolder },
    rateLimit: { windowMs: rateLimitWindowMs, limit: rateLimitLimit, standardHeaders: 'draft-8', legacyHeaders: false },
  };
};

export default createConfig;

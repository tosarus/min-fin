import path from 'path';
import moduleAlias from 'module-alias';
import 'reflect-metadata';

moduleAlias.addAlias('@shared', path.resolve(__dirname, '../shared'));

// eslint-disable-next-line @typescript-eslint/no-require-imports
exports = module.exports = require('./server');

import path from 'path';
import moduleAlias from 'module-alias';
import 'reflect-metadata';

moduleAlias.addAlias('@shared', path.resolve(__dirname, '../shared'));

exports = module.exports = require('./server');

#!/usr/bin/env node

require('reflect-metadata');
const { bootstrapFromCli } = require('../dist/node-private-tools');

bootstrapFromCli().then(_ => console.log('done'), err => console.error(err));

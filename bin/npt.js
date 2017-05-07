#!/usr/bin/env node

require('reflect-metadata');
const { bootstrapFromCli } = require('../dist/node-private-tools');

bootstrapFromCli().catch(err => console.error(err));

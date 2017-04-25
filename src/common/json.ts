import { readFileSync } from 'fs';
import { template } from 'lodash';

const { normalize } = require('fs-plus');

export function loadJson(path: string) {
  return JSON.parse(readFileSync(normalize(template(path)(process.env)), 'utf8'));
}

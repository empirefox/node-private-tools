import { ajv } from './ajv';

const validate = ajv.compile(require('./schema.json'));
const valid = validate('./node-private-tools.json');
if (!valid) console.log(ajv.errors);
console.log('done')
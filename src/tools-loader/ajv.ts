import { template } from 'lodash';
import { argv } from 'yargs';
import * as Ajv from 'ajv';

const { normalize } = require('fs-plus');

function expand(tplData, data, dataPath, parentData, parentDataProperty) {
  parentData[parentDataProperty] = normalize(template(data)(tplData));
}

const tplDatas = {
  env: process.env,
  yargs: argv,
};

export const ajv = new Ajv();

ajv.addKeyword('expand', {
  type: ['string'],
  valid: true,
  modifying: true,
  compile: (sch, parentSchema) => (data, dataPath, parentData, parentDataProperty) => {
    const tplData = tplDatas[sch];
    if (!tplData) {
      return false;
    }
    expand(tplData, data, dataPath, parentData, parentDataProperty);
    return true;
  }
});

ajv.addSchema(require('../go-tag-apis/schema.json'), 'go-tag-apis');
ajv.addSchema(require('../go-const-ts/schema.json'), 'go-const-ts');

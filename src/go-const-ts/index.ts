import { join } from 'path';
import { usage } from 'yargs';
import { compile } from 'handlebars';
import { template } from 'lodash';

import { formateWrite, writeFile, loadJson } from '../common';
import { GoConst } from './go-const';
import { Prettier } from './pretty';
import { indexBasePipeTpl, pipeTpl, pipeIndexTpl, enumTpl, enumIndexTpl } from './templates';

const { normalize, writeFileSync, removeSync } = require('fs-plus');

const argv = usage('Usage: $0 [options]')
  .example('$0 -c go-const.json', `generate enums from go consts, go-const.json file:
    {
      "src": ["./models"],
      "dist": "./consts/",
      "langs": ["zh"],
      "prettiesRoots": [
        "./pretties"
      ]
    }
  `)
  .options({
    c: {
      alias: 'config',
      nargs: 1,
      describe: 'config file, support .json',
      default: normalize('./go-const.json'),
      coerce: (arg: string) => loadJson(arg),
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const pipeItem = compile(pipeTpl);
const enumItem = compile(enumTpl);
const pipeIndex = compile(pipeIndexTpl);
const enumIndex = compile(enumIndexTpl);

const config = <GoConst>argv.c;
const dist = normalize(template(config.dist)(process.env));

const prettier = new Prettier(config);

const errorsPath = join(dist, `go-const-errors.log`);
removeSync(errorsPath);
if (prettier.errors.length) {
  writeFileSync(errorsPath, prettier.errors.join('\n'), { encoding: 'utf8' });
}

formateWrite(join(dist, 'pipe/index-base.pipe.ts'), indexBasePipeTpl);

formateWrite(join(dist, `pipe.ts`), pipeIndex(prettier));
formateWrite(join(dist, `enum.ts`), enumIndex(prettier));

prettier.types.forEach(type => {
  formateWrite(join(dist, `pipe/${type.pipe}.pipe.ts`), pipeItem(type));
  formateWrite(join(dist, `enum/${type.pipe}.enum.ts`), enumItem(type));
  // names
  writeFile(join(dist, `names/${type.pipe}.json`), type.names);
  // xlangJson
  type.langs.forEach(lang => writeFile(join(dist, `xlang/${type.pipe}/${lang.lang}.json`), lang.langJson));
});

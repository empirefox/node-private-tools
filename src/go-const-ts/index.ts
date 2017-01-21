import { readFileSync } from 'fs';
import { usage } from 'yargs';
import { compile } from 'handlebars';
import { GoConst } from './go-const';
import { parseGoFiles } from './parse-go-files';
import { Prettier } from './pretty';
import { TplData, constsTpl } from './templates';

const {normalize, writeFileSync} = require('fs-plus');

let argv = usage('Usage: $0 [options]')
  .example('$0 -c go-const.json', `generate enums from go consts, go-const.json file:
    {
      "src": ["./models"],
      "dist": "./consts.ts",
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
      coerce: (arg: string) => JSON.parse(readFileSync(arg, 'utf8')),
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

let config = <GoConst>argv.c;
let consts = parseGoFiles(config);
let prettier = new Prettier(config, consts);
let pretties = prettier.pretties();

prettier.errors.forEach(err => console.log(err));

let tplData: TplData = {
  errors: prettier.errors,
  consts: Object.keys(consts).map(typ => ({ typ, enums: consts[typ] })),
  pretties: Object.keys(pretties).map(typ => ({ typ, pretty: pretties[typ].map(v => `'${v}'`) })),
  pipes: Object.keys(prettier.prettieJsons).map(typ => ({ typ, name: prettier.prettieJsons[typ].pipe })),
};

let content = compile(constsTpl)(tplData);
writeFileSync(normalize(config.dist), content, { encoding: 'utf8' });

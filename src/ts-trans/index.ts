import { readFileSync } from 'fs';
import { usage } from 'yargs';
import { compile } from 'handlebars';
import { merge } from 'lodash';
import { lookupGotag } from '../common';
import { Config } from './ts-trans.config';
import { parse, Entry } from './parse';
import { TplData, constsTpl } from './templates';

const {normalize, writeFileSync} = require('fs-plus');
const globby = require('globby');

const argv = usage('Usage: $0 [options]')
  .example('$0 -c ts-trans.json', `generate translate from ts interface, ts-trans.json file:
        {
          "src": [
            "./src/**/user.ts"
          ],
          "dist": "./consts.ts",
          "tag": "tr",
          "lang": "zh"
        }
  `)
  .options({
    c: {
      alias: 'config',
      nargs: 1,
      describe: 'config file, support .json',
      default: normalize('./ts-trans.json'),
      coerce: (arg: string) => JSON.parse(readFileSync(arg, 'utf8')),
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const config = <Config>argv.c;
const lang = config.lang || 'en';

const transform = (v: string) => {
  let r = lookupGotag(v, lang) || (lang !== 'en' && lookupGotag(v, 'en'));
  return r || v;
}

(<Promise<string[]>>globby(config.src)).then(paths => {
  let raw = paths.map(filepath => parse(filepath, config.tag, transform));
  let raws = merge<Dict<Entry[]>>({}, ...raw);

  let tplData: TplData = {
    trans: Object.keys(raws).sort().map(typ => ({ typ, tr: raws[typ] })),
    pipes: Object.keys(raws).sort().map(typ => ({ typ, name: config.pipePrefix || '' + typ })),
  };

  let content = compile(constsTpl)(tplData);
  writeFileSync(normalize(config.dist), content, { encoding: 'utf8' });
});

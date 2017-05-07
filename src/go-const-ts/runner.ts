import { join } from 'path';
import { compile } from 'handlebars';

import { Runner, RunnerWithSchema, formateWrite, writeFile } from '../common';
import { GoConstTsConfig } from './go-const';
import { Prettier } from './pretty';
import { indexBasePipeTpl, pipeTpl, pipeIndexTpl, enumTpl, enumIndexTpl } from './templates';

const { writeFileSync, removeSync } = require('fs-plus');

const pipeItem = compile(pipeTpl);
const enumItem = compile(enumTpl);
const pipeIndex = compile(pipeIndexTpl);
const enumIndex = compile(enumIndexTpl);

export class GoConstTs implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'go-const-ts',
      schema: require('../schemas/go-const-ts.json'),
      runner: GoConstTs,
    };
  }

  constructor(public config: GoConstTsConfig) { }

  run(): Promise<any> {
    const dist = this.config.dist;
    const prettier = new Prettier(this.config);

    return prettier.parse().then(types => {
      const errorsPath = join(dist, `go-const-errors.log`);
      removeSync(errorsPath);
      if (prettier.errors.length) {
        writeFileSync(errorsPath, prettier.errors.join('\n'), { encoding: 'utf8' });
      }

      const promises = [
        formateWrite(join(dist, 'pipe/index-base.pipe.ts'), indexBasePipeTpl),
        formateWrite(join(dist, `pipe.ts`), pipeIndex({ types })),
        formateWrite(join(dist, `enum.ts`), enumIndex({ types })),
      ];

      types.forEach(type => {
        promises.push(
          formateWrite(join(dist, `pipe/${type.pipe}.pipe.ts`), pipeItem(type)),
          formateWrite(join(dist, `enum/${type.pipe}.enum.ts`), enumItem(type)),
          // names
          writeFile(join(dist, `names/${type.pipe}.json`), type.names),
          // xlangJson
          ...type.langs.map(lang => writeFile(join(dist, `xlang/${type.pipe}/${lang.lang}.json`), lang.langJson)),
        );
      });

      return Promise.all(promises);
    });
  }

}

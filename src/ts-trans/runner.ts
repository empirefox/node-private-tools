import { join } from 'path';
import { compile } from 'handlebars';

import { TsTypeTagParser, Runner, RunnerWithSchema, writeFile, formateWrite } from '../common';
import { TsTransConfig } from '../schemas';
import { indexBasePipeTpl, pipeTpl, pipeIndexTpl } from './templates';

const pipeItem = compile(pipeTpl);
const pipeIndex = compile(pipeIndexTpl);

export class TsTrans implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'ts-trans',
      schema: require('../schemas/ts-trans.json'),
      runner: TsTrans,
    };
  }

  private parser: TsTypeTagParser;

  constructor(private config: TsTransConfig) {
    this.parser = new TsTypeTagParser(config.tag);
  }

  run(): Promise<any> {
    const dist = this.config.dist;
    return this.parser.parseTransform(this.config.src, this.config.langs, this.config.pipePrefix).then(types => {
      const promises = [
        formateWrite(join(dist, 'pipe/index-base.pipe.ts'), indexBasePipeTpl),
        formateWrite(join(dist, `pipe.ts`), pipeIndex({ types })),
      ];

      types.forEach(type => {
        promises.push(
          formateWrite(join(dist, `pipe/${type.pipe}.pipe.ts`), pipeItem(type)),
          // xlangJson
          ...type.tags.map(lang => writeFile(join(dist, `xlang/${type.pipe}/${lang.tag}.json`), lang.fields)),
        );
      });

      return Promise.all(promises);
    });
  }

}

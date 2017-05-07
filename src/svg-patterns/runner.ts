import { Runner, RunnerWithSchema, writeFile } from '../common';
import { SvgPatternsConfig } from '../schemas';
import { parse } from './parse';

export class SvgPatterns implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'svg-patterns',
      schema: require('../schemas/svg-patterns.json'),
      runner: SvgPatterns,
    };
  }

  constructor(public config: SvgPatternsConfig) { }

  run(): Promise<any> {
    return parse(this.config.url).then(svgs => writeFile(this.config.dist, svgs));
  }

}

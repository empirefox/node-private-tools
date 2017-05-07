import { compile, compileFromFile } from 'json-schema-to-typescript';

import { Runner, RunnerWithSchema } from '../common';
import { Json2TsConfig } from './config';

const globby = require('globby');
const { writeFileSync } = require('fs-plus');

export class Json2ts implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'json2ts',
      schema: require('../schemas/json2ts.json'),
      runner: Json2ts,
    };
  }

  constructor(public config: Json2TsConfig) { }

  run(): Promise<void> {
    return (<Promise<string[]>>globby(this.config.src)).then(paths =>
      Promise.all(paths.map(path => compileFromFile(path))).then(contents => {
        writeFileSync(this.config.dist, contents.join('\n'), { encoding: 'utf8' });
      })
    );
  }

}

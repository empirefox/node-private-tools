import { basename, parse, format, join } from 'path';
import { format as formatDate } from 'date-fns';
import { encode } from 'iconv-lite';

import { Runner, RunnerWithSchema, readGlobJoin, writeFile } from '../common';
import { ToMpeg4Config } from '../schemas';
import { Converter } from './convert';

const fs = require('fs-plus');
const globby = require('globby');

const invalidChars = /[\\/:*?\"<>|]/g;
const replaceChar = '_';

export class ToMpeg4 implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'to-mpeg4',
      schema: require('../schemas/to-mpeg4.json'),
      runner: ToMpeg4,
    };
  }

  constructor(public config: ToMpeg4Config) { }

  run(): Promise<any> {
    const { src, dist } = this.config;
    let { outputOptions = [] } = this.config;
    fs.makeTreeSync(dist);
    console.log(`target dir: ${dist}`);
    outputOptions = Converter.initOutputOptions(outputOptions);

    return Promise.all([
      // exists set
      readGlobJoin([join(this.config.history, '*.log')]).then(history => {
        return new Set([
          ...fs.listSync(dist, ['mp4']).map((name: string) => basename(name, '.mp4')),
          ...(history || '').split('\n'),
        ]);
      }),
      // mvs paths
      <Promise<string[]>>globby(src),
    ]).then(([exists, mvs]) => {
      // add all non-exist to converters
      const converters: Converter[] = [];
      mvs.forEach(mv => {
        const dstName = encode(parse(mv).name, 'utf8').toString().replace(invalidChars, replaceChar);
        if (exists.has(dstName)) {
          console.log(`exist: ${dstName}`);
        } else {
          const dst = format({
            root: '/',
            dir: dist,
            base: '',
            ext: '.mp4',
            name: dstName,
          });
          converters.push(new Converter(dstName, mv, dst, outputOptions));
        }
      });

      const total = converters.length;
      const converted: string[] = [];
      let failed = 0;
      // convert one by one
      return converters.reduce(
        (cur, next, index) => {
          // log convert result
          console.log(`> ${index + 1}/${total}, converted(${converted}), failed(${failed}) <`);
          return cur.then(_ => next.convert().then(err => {
            if (err) {
              console.error('An error occurred: ' + err.message);
              failed++;
            } else {
              console.log(`>>> total(${total}), converted(${converted}), failed(${failed}) <<<`);
              converted.push(next.basename);
            }
            if (converted.length + failed === total) {
              console.log('ToMpeg4 done!');
            }
            return err;
          }));
        }, Promise.resolve() as Promise<any> as Promise<Error | undefined>)
        .then(_ => writeFile(formatDate(new Date(), 'YYMMDD.log'), converted.join('\n')));
    });
  }

}

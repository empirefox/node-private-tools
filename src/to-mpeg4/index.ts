import { basename, parse, format } from 'path';
import { usage } from 'yargs';
import { encode } from 'iconv-lite';
import { convert } from './convert';
const fs = require('fs-plus');

let argv: { o: string; i: string } = usage('Usage: $0 [options]')
  .example('$0 -o ~/mpeg4 -i ~/mv', 'convert from `mv` to `mpeg4`')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output directory',
      default: '~/mpeg4',
      coerce: (arg: string) => fs.normalize(arg),
    },
    i: {
      alias: 'in',
      nargs: 1,
      describe: 'input directory',
      default: '~/.cache/kuwo/mv',
      coerce: (arg: string) => fs.normalize(arg),
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

let {i: src, o: dest} = argv;
let invalidChars = /[\\/:*?\"<>|]/g;
let replaceChar = '_';
let exists = new Set(fs.listSync(dest, ['mp4']).map((name: string) => basename(name, '.mp4')));
console.log(`target dir: ${dest}`);

fs.makeTreeSync(dest);

let mvs: string[] = fs.listSync(src, 'mp4,mkv,avi,flv'.split(','));
let converted = 0;

function next(index: number) {
  if (index < mvs.length) {
    let src = mvs[index++];
    let dstName = encode(parse(src).name, 'utf8').toString().replace(invalidChars, replaceChar);
    if (exists.has(dstName)) {
      console.log(`exist: ${dstName}`);
      next(index);
    } else {
      let dst = format({
        root: "/",
        dir: dest,
        base: '',
        ext: '.mp4',
        name: dstName,
      });
      convert(src, dst).then(err => {
        if (err) {
          console.error('An error occurred: ' + err.message);
        } else {
          converted++;
        }
        next(index);
      });
    }
  } else {
    console.log(`All done! ${converted} files converted.`);
  }
}

next(0);

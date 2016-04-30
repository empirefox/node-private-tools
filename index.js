'use strict';

let path = require('path');
let fs = require('fs-plus');
let argv = require('yargs').argv;
let iconv = require('iconv-lite');
let convert = require('./convert');

let invalidChars = /[\\/:*?\"<>|]/g;
let replaceChar = '_';
let fromDir = fs.normalize(argv.from || '~/.cache/kuwo/mv');
let toDir = fs.normalize(argv.to || '~/视频/mpeg4');
let exists = new Set(fs.listSync(toDir, ['mp4']).map(name => path.basename(name, '.mp4')));
console.log(`target dir: ${toDir}`);

fs.makeTreeSync(toDir);

let mvs = fs.listSync(fromDir, 'mp4,mkv,avi,flv'.split(','));
let converted = 0;

function next(index) {
  if (index < mvs.length) {
    let src = mvs[index++];
    let dstName = iconv.encode(path.parse(src).name, 'utf8').toString().replace(invalidChars, replaceChar);
    // console.log(`${exists.has(dstName)}: ${dstName}`);
    if (exists.has(dstName)) {
      console.log(`exist: ${dstName}`);
      next(index);
    } else {
      let dst = path.format({
        root: "/",
        dir: toDir,
        base: '',
        ext: '.mp4',
        name: dstName,
      });
      convert(src, dst).then(n => {
        converted += n;
        next(index);
      });
    }
  } else {
    console.log(`All done! ${converted} files converted.`);
  }
}

next(0);

import { readFileSync } from 'fs';
import { GoConst } from './go-const';

const {listSync, normalize, writeFileSync} = require('fs-plus');
const lineRe = /^\s*(\w+)?(?:\s*\/\/.*)?$/; // word // xxx

export function parseGoFiles(config: GoConst): Dict<string[]> {
  let types = <Dict<string[]>>{};
  config.src.forEach(dir => {
    let list: string[] = listSync(normalize(dir), ['go']);
    list.forEach(path => {
      let file = readFileSync(path, 'utf8');
      let match: RegExpExecArray | null;

      let reTyp = /(?:\(\s*)(\w+) (\w+) = iota(?: \/\/.*)?([^\)]+)/g; // const? (word type = iota // xxx...)
      while (match = reTyp.exec(file)) {
        let v: string[] = [];
        match[3].split('\n').some(line => {
          let m = line.match(lineRe);
          if (m && m[1]) {
            v.push(m[1]);
          }
          // console.log(!m,m,line)
          return !m;
        });
        types[match[2]] = [match[1], ...v];
      }
    });
  });

  if (config.includeTypes && config.includeTypes.length) {
    config.includeTypes.forEach(t => {
      if (t in types) {
        delete types[t];
      }
    });
  } else if (config.excludeTypes && config.excludeTypes.length) {
    config.excludeTypes.forEach(t => {
      if (!(t in types)) {
        delete types[t];
      }
    });
  }
  return types;
}
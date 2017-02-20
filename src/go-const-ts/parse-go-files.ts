import { readFileSync } from 'fs';
import { GoConst, Const } from './go-const';

const {listSync, normalize, writeFileSync} = require('fs-plus');
const lineRe = /^\s*(\w+)?(\s*\/\/.*)?$/; // (word)?( // xxx)?
const wordRe = /^\w+$/;

export function parseGoFiles(config: GoConst): Dict<Const[]> {
  let types = <Dict<Const[]>>{};
  config.src.forEach(dir => {
    let list: string[] = listSync(normalize(dir), ['go']);
    list.forEach(path => {
      let file = readFileSync(path, 'utf8');
      let match: RegExpExecArray | null;

      let reComment = config.defaultInlinePrettyTag ?
        new RegExp(`^\\s*\\/\\/\\s*${config.defaultInlinePrettyTag}:"([^"]+)"\\s*.*$`) : null;

      // const? (word type = iota)( // xxx...)?(next line)
      // match: first_key type comment? all_others
      let reTyp = /(?:\(\s*)(\w+)\s*(\w+)\s*=\s*iota(\s*\/\/.*)?([^\)]+)/g;
      while (match = reTyp.exec(file)) {
        let v: Const[] = [];
        match[match.length === 5 ? 4 : 3].split('\n').some(line => {
          let m = line.match(lineRe);
          // only if name exist
          if (m && m[1] && wordRe.test(m[1])) {
            // get pretty only if tag set and comment exist
            let prettyMatch = reComment && m[2] ? m[2].match(reComment) : null;
            v.push({ name: m[1], pretty: prettyMatch ? prettyMatch[1] : null });
          }
          // console.log(!m,m,line)
          return !m;
        });
        let prettyMatch = reComment && match.length === 5 && match[3] ? match[3].match(reComment) : null;
        let first = { name: match[1], pretty: prettyMatch ? prettyMatch[1] : null };
        types[match[2]] = [first, ...v];
      }
    });
  });

  if (config.includeTypes && config.includeTypes.length) {
    config.includeTypes.forEach(t => {
      if (!(t in types)) {
        delete types[t];
      }
    });
  } else if (config.excludeTypes && config.excludeTypes.length) {
    config.excludeTypes.forEach(t => {
      if (t in types) {
        delete types[t];
      }
    });
  }
  return types;
}

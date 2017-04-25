import { readFileSync } from 'fs';
import { template } from 'lodash';
import { GoConst, ConstCommentElement, ConstCommentType } from './go-const';

const { listSync, normalize } = require('fs-plus');

const reCommentTag = /^\s*\/\/.*\s`([^`]+)`\s*.*$/;
const lineRe = /^\s*(\w+)?(\s*\/\/.*)?$/; // (word)?( // xxx)?
const wordRe = /^\w+$/;

export function parseGoComment(config: GoConst): ConstCommentType[] {
  let types: ConstCommentType[] = [];
  config.src.forEach(dir => {
    let list: string[] = listSync(normalize(template(dir)(process.env)), ['go']);
    list.forEach(path => {
      let file = readFileSync(path, 'utf8');
      let match: RegExpExecArray | null;

      // const? (word type = iota)( // xxx...)?(next line)
      // match: first_key type comment? all_others
      let reTyp = /(?:\(\s*)(\w+)\s*(\w+)\s*=\s*iota(\s*\/\/.*)?([^\)]+)/g;
      while (match = reTyp.exec(file)) {
        let v: ConstCommentElement[] = [];
        match[match.length === 5 ? 4 : 3].split('\n').some(line => {
          let m = line.match(lineRe);
          // only if name exist
          // m[1]: name
          // m[2]: comment
          if (m && m[1] && wordRe.test(m[1])) {
            // get pretty only if tag set and comment exist
            // tagMatch[1]: tag content
            let tagMatch = m[2] && m[2].match(reCommentTag) || [];
            v.push({ name: m[1], tag: tagMatch[1] });
          }
          // console.log(!m,m,line)
          return !m;
        });
        // tagMatch[1]: tag content
        let tagMatch = reCommentTag && match.length === 5 && match[3] && match[3].match(reCommentTag) || [];
        let first = { name: match[1], tag: tagMatch[1] };
        types.push({ type: match[2], elements: [first, ...v] });
      }
    });
  });

  const { includeTypes, excludeTypes } = config;
  if (includeTypes && includeTypes.length) {
    types = types.filter(item => ~includeTypes.findIndex(type => item.type === type));
  } else if (excludeTypes && excludeTypes.length) {
    types = types.filter(item => !~excludeTypes.findIndex(type => item.type === type));
  }
  return types;
}

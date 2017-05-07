import { readGlobJoin } from '../common';
import { GoConstTsConfig, ConstCommentElement, ConstCommentType } from './go-const';

// const? (word type = iota)( // xxx...)?(next line)
// match: first_key type comment? all_others
const reTyp = /(?:\(\s*)(\w+)\s*(\w+)\s*=\s*iota(\s*\/\/.*)?([^\)]+)/g;
const reCommentTag = /^\s*\/\/.*\s`([^`]+)`\s*.*$/;
const lineRe = /^\s*(\w+)?(\s*\/\/.*)?$/; // (word)?( // xxx)?
const wordRe = /^\w+$/;

export function parseGoComment(config: GoConstTsConfig): Promise<ConstCommentType[]> {
  return readGlobJoin(config.src).then(content => {
    let types: ConstCommentType[] = [];
    let match: RegExpExecArray | null;

    while (match = reTyp.exec(content)) {
      const v: ConstCommentElement[] = [];
      match[match.length === 5 ? 4 : 3].split('\n').some(line => {
        const m = line.match(lineRe);
        // only if name exist
        // m[1]: name
        // m[2]: comment
        if (m && m[1] && wordRe.test(m[1])) {
          // get pretty only if tag set and comment exist
          // tagMatch[1]: tag content
          const tagMatch = m[2] && m[2].match(reCommentTag) || [];
          v.push({ name: m[1], tag: tagMatch[1] });
        }
        // console.log(!m,m,line)
        return !m;
      });
      // tagMatch[1]: tag content
      const tagMatch = reCommentTag && match.length === 5 && match[3] && match[3].match(reCommentTag) || [];
      const first = { name: match[1], tag: tagMatch[1] };
      types.push({ type: match[2], elements: [first, ...v] });
    }

    const { includeTypes, excludeTypes } = config;
    if (includeTypes && includeTypes.length) {
      types = types.filter(item => ~includeTypes.findIndex(type => item.type === type));
    } else if (excludeTypes && excludeTypes.length) {
      types = types.filter(item => !~excludeTypes.findIndex(type => item.type === type));
    }
    return types;
  });
}

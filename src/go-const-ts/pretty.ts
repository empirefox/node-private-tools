import { join } from 'path';
import { isEmpty, omitBy } from 'lodash';
import { lookupGotag, loadJson } from '../common';
import { GoConstTsConfig, ConstCommentType, ConstTypeTr, ConstTypeTrs, ConstType } from './go-const';
import { parseGoComment } from './parse-go-files';

const { isFileSync, normalize } = require('fs-plus');

export class Prettier {
  errors: string[] = [];

  constructor(private config: GoConstTsConfig) { }

  parse(): Promise<ConstType[]> {
    return parseGoComment(this.config).then(types => this.parseConstCommentTypes(types))
  }

  private parseConstCommentTypes(commentTypes: ConstCommentType[]): ConstType[] {
    const types: ConstType[] = commentTypes.map(({ type, elements }) => {
      const langs: ConstTypeTrs[] = this.config.langs.map(lang => {
        const langJson: string[] = [];
        const configPretty = this.findConfigPretty(type, lang);
        const trs: ConstTypeTr[] = elements.map(({ name, tag }) => {
          let tr = configPretty[name] || tag && lookupGotag(tag, lang);
          if (!tr) {
            this.errors.push(`${type}-${lang}.${name} should have pretty`);
          }
          tr = tr || name; // use name if tr not found
          delete configPretty[name];
          langJson.push(tr);
          return { name, tr };
        });
        const unused = Object.keys(configPretty);
        if (unused.length) {
          this.errors.push(`${type}-${lang} pretty not used: ${unused}`);
        }
        return { lang, trs, langJson };
      });
      const pipe = this.config.pipePrefix + type;
      const names = langs[0].trs.map(tr => tr.name);
      return { type, pipe, langs, names };
    });
    return types;
  }

  private findConfigPretty(typ: string, lang: string): Dict<string> {
    const cps: Dict<Dict<string>> | undefined = this.config.pretties;
    const cp = cps && cps[typ];
    const path = cp && cp[lang] || this.findPrettyPath(`${typ}-${lang}`) || this.findPrettyPath(`${typ}/${lang}`);
    const json = path ? omitBy(loadJson(path), isEmpty) : {};
    return <Dict<string>>json;
  }

  private findPrettyPath(name: string) {
    const roots = this.config.prettiesRoots;
    return roots && roots.map(root => join(root, `${name}.json`)).find(isFileSync);
  }

}

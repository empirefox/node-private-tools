import { join } from 'path';
import { readFileSync } from 'fs';
import { camelCase, difference, isEmpty, mapValues, omitBy } from 'lodash';
import { Const, GoConst, Pretty } from './go-const';
import { load } from '../common/json';

const {isFileSync, normalize} = require('fs-plus');

export interface PrettyJson {
  pipe: string;
  json: Dict<string>;
}

export class Prettier {
  errors: string[] = [];
  prettyJsons: Dict<PrettyJson>;
  private roots: string[];
  private prettyPipePrefix: string;

  constructor(
    private config: GoConst,
    private consts: Dict<string[]>,
    private prettyJsonsSrc: Dict<Dict<string>>) {
    // init roots
    let roots = (config.prettiesRoots || []).slice();
    roots[0] = roots[0] || './pretties';
    this.roots = roots.map(root => normalize(root));

    // init prettyPipePrefix
    this.prettyPipePrefix = config.prettyPipePrefix || '';

    // init prettyJsons
    this.prettyJsons = mapValues(prettyJsonsSrc, (json, c) => ({ pipe: this.prettyPipePrefix + c, json }));

    // init pretties, overwrite prettyJsons
    let pretties: Dict<Pretty> = config.pretties || {};
    Object.keys(consts).forEach(c => {
      let pretty: Pretty = pretties[c] || {};
      let path = pretty.path || this.findPretty(c);
      if (path) {
        this.prettyJsons[c] = this.prettyJsons[c] || {};
        this.prettyJsons[c].json = Object.assign({}, this.prettyJsons[c].json, omitBy(load(path), isEmpty));
      }
      if (pretty.pipe && this.prettyJsons[c]) {
        this.prettyJsons[c].pipe = pretty.pipe;
      }
    });
  }

  prettify(): Dict<string[]> {
    let ps: Dict<string[]> = {};
    Object.keys(this.prettyJsons).forEach(typ => ps[typ] = this.prettifyOne(typ));
    return ps;
  }

  private prettifyOne(typ: string): string[] {
    let typConst = this.consts[typ];
    let json = this.prettyJsons[typ].json;

    // validate all pretty is in consts
    let diff = difference(Object.keys(json), typConst);
    if (diff && diff.length) {
      this.errors.push(`${typ} pretty not needed: ${diff}`);
    }

    return typConst.map((name, index) => {
      let v = json[name];
      if (!v) {
        this.errors.push(`${typ}.${name} should have pretty`);
      }
      return v || name;
    });
  }

  private findPretty(typ: string) {
    return this.roots.map(root => join(root, `${typ}.json`)).find(isFileSync);
  }
}

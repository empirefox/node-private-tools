import { readFileSync } from 'fs';
import * as ts from 'typescript';
import { merge, toPairs, fromPairs } from 'lodash';

import { lookupGotag } from '../common';
import { Entry, CommentTagEntriesTypeDict, FeildTagValues, ValueEntriesTypes } from './ts-type-parser.types';

const globby = require('globby');

const inameRe = /^I[A-Z].*$/;

export class TsTypeTagParser {

  constructor(private commentTagName: string) { }

  parseTransform(src: string[], tags: string[], pipePrefix: string): Promise<ValueEntriesTypes[]> {
    return this.parseGlob(src).then(typeDict => {
      return toPairs(typeDict).map<ValueEntriesTypes>(([type, entries]: [string, Entry[]]) => {
        return {
          type,
          pipe: pipePrefix + type,
          tags: tags.map<FeildTagValues>(tag => ({
            tag: tag,
            fields: fromPairs(entries.map(({ field, value }) => [field, lookupGotag(value, tag) || field])),
          })),
        };
      });
    });
  }

  parseGlob(src: string[]): Promise<CommentTagEntriesTypeDict> {
    return (<Promise<string[]>>globby(src)).then(paths => {
      const ps = paths.map(async filepath => await this.parseFileSync(filepath));
      return Promise.all(ps).then(raws => merge<CommentTagEntriesTypeDict>({}, ...raws));
    });
  }

  parseFileSync(filename: string): CommentTagEntriesTypeDict {
    const sourceFile = ts.createSourceFile(filename, readFileSync(filename).toString(), ts.ScriptTarget.ES2016, false, ts.ScriptKind.TS);

    const types: CommentTagEntriesTypeDict = {};
    const statements = sourceFile.statements || [];
    statements.filter(iinter => iinter.kind === ts.SyntaxKind.InterfaceDeclaration && this.findTagComment(iinter) !== 'disabled')
      .forEach(iinter => {
        const entries: Entry[] = [];
        const inter = <ts.InterfaceDeclaration>iinter;
        inter.members.filter(field => field.name && field.kind === ts.SyntaxKind.PropertySignature).forEach(field => {
          const value = this.findTagComment(field);
          if (value !== undefined) {
            const fieldName: ts.Identifier = <any>field.name;
            entries.push({ field: fieldName.text, value });
            return;
          }
        });
        if (entries.length) {
          let typeName = inter.name.text;
          typeName = inameRe.test(typeName) ? typeName.slice(1) : typeName;
          types[typeName] = entries;
        }
      });

    return types;
  }

  findTagComment(node: any): string | undefined {
    for (const jsDoc of node['jsDoc'] || []) {
      const tags: ts.JSDocTag[] = (jsDoc && jsDoc.tags) || [];
      const tag = tags.find(item => item && item.tagName && item.tagName.text === this.commentTagName);
      if (tag) {
        let comment = tag.comment;
        if (comment && (comment = comment.trim())) {
          return comment;
        }
      }
    }
    return undefined;
  }

}

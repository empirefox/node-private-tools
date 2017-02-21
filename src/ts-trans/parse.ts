import { readFileSync } from 'fs';
import * as ts from 'typescript';

const inameRe = /^I[A-Z].*$/;

export interface Entry {
  key: string;
  value: string;
}

export function parse(filename: string, tagName: string, transform?: (v: string) => string): Dict<Entry[]> {
  const sourceFile = ts.createSourceFile(filename, readFileSync(filename).toString(), ts.ScriptTarget.ES2016, false, ts.ScriptKind.TS);

  let trs: Dict<Entry[]> = {};
  (sourceFile.statements || []).filter(iinter => iinter.kind == ts.SyntaxKind.InterfaceDeclaration && findTagComment(iinter, 'trans') !== 'disabled').forEach(iinter => {
    let tr: Entry[] = [];
    let hasTr = false;
    let inter = <ts.InterfaceDeclaration>iinter;
    inter.members.filter(field => field.name && field.kind === ts.SyntaxKind.PropertySignature).forEach(field => {
      let value = findTagComment(field, tagName);
      if (value) {
        let name: ts.Identifier = <any>field.name;
        tr.push({
          key: name.text,
          value: transform ? transform(value) : value,
        });
        hasTr = true;
        return;
      }
    });
    if (hasTr) {
      let name = inter.name.text;
      name = inameRe.test(name) ? name.slice(1) : name;
      trs[name] = tr;
    }
  });

  return trs;
}

export function findTagComment(node: any, tagName: string): string | null {
  for (let jsDoc of node['jsDoc'] || []) {
    let tags: ts.JSDocTag[] = (jsDoc && jsDoc.tags) || [];
    let tag = tags.find(tag => tag && tag.tagName && tag.tagName.text === tagName);
    if (tag) {
      let comment = tag.comment;
      if (comment && (comment = comment.trim())) {
        return comment;
      }
    }
  }
  return null;
}

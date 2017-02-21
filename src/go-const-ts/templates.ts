export interface ConstData {
  typ: string;
  enums: string[];
}

export interface PrettyData {
  typ: string;
  pretty: string[];
}

export interface PipeData {
  typ: string;
  name: string;
}

export interface TplData {
  errors: string[];
  consts: ConstData[];
  pretties: PrettyData[];
  pipes: PipeData[];
}

export const constsTpl = `// Generated by node-private-tools
// tslint:disable:max-line-length
// tslint:disable:whitespace
import { Pipe, PipeTransform } from '@angular/core';
{{#each errors}}console.error('{{{this}}}')
{{/each}}

{{#each consts}}export enum {{{typ}}} { {{{enums}}} }
{{/each}}

export const pretties = {
{{#each pretties}}  {{{typ}}}: [{{{pretty}}}],
{{/each}}
};

{{#each pipes}}@Pipe({ name: '{{{name}}}' })
export class {{{typ}}}Pipe implements PipeTransform {
  transform(value: number) {
    return pretties.{{{typ}}}[value] || '';
  }
}
{{/each}}
`;
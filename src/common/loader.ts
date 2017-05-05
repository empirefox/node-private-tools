import { KeywordDefinition, FormatDefinition } from 'ajv';

export interface Runner {
  run(): Promise<any> | void;
}

export interface RunnerConstructor extends Function {
  new (config: any): Runner;
}

export interface RunnerWithSchema {
  $tool: string;
  schema: Object;
  runner: RunnerConstructor;
  keywords?: { keyword: string; define: KeywordDefinition }[];
  formats?: { format: string; define: FormatDefinition }[];
}
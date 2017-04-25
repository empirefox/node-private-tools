export interface GoConst {
  src: string[];
  dist: string;
  langs: string[]; // will be overwrite by [pretty].json file
  includeTypes?: string[]; // priority: includeTypes>excludeTypes
  excludeTypes?: string[]; // priority: includeTypes>excludeTypes
  prettiesRoots?: string[];
  pretties?: Dict<Dict<string>>; // type.lang.path
  pipePrefix?: string;
}

export interface ConstCommentElement {
  name: string;
  tag?: string;
}

export interface ConstCommentType {
  type: string;
  elements: ConstCommentElement[];
}

export interface ConstTypeTr {
  name: string;
  tr: string;
}

export interface ConstTypeTrs {
  lang: string;
  trs: ConstTypeTr[];
  langJson: string[];
}

export interface ConstType {
  type: string;
  pipe: string;
  langs: ConstTypeTrs[];
  names: string[];
}

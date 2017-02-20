export interface Pretty {
  pipe?: string;
  path?: string;
}

export interface GoConst {
  src: string[];
  dist: string;
  defaultInlinePrettyTag?: string; // will be overwrite by [pretty].json file
  includeTypes?: string[]; // priority: includeTypes>excludeTypes
  excludeTypes?: string[]; // priority: includeTypes>excludeTypes
  prettiesRoots?: string[];
  pretties?: Dict<Pretty>;
  prettyPipePrefix?: string;
}

export interface Const {
  name: string;
  pretty: string | null;
}

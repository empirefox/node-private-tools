export interface Pretty {
  pipe?: string;
  path?: string;
}

export interface GoConst {
  src: string[];
  dist: string;
  includeTypes?: string[];
  excludeTypes?: string[];
  prettiesRoots?: string[];
  pretties?: Dict<Pretty>;
  prettyPipePrefix?: string;
}

export interface Dict<T> {
  [key: string]: T;
  [key: number]: T;
  // [key: symbol]: T;
}

export interface Entry {
  field: string;
  value: string;
}

/**
 * &#64;tr xxx => [].value == xxx
 */
export type CommentTagEntriesTypeDict = Dict<Entry[]>;

/**
 * &#64;tr en:"ok" => [].value == ok
 */
export type ValueEntriesTypeDict = Dict<Entry[]>;

/**
 * &#64;tr en:"ok" => enrties[].value == ok
 */
export interface FeildTagValues {
  tag: string;
  fields: Dict<string>;
}

/**
 * &#64;tr en:"ok" => types[].enrties[].value == ok, tag == en
 */
export interface ValueEntriesTypes {
  /**
   * go tag segment name
   */
  type: string;
  pipe: string;
  tags: FeildTagValues[];
}

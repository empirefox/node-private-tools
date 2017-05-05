export interface Json2TsConfig {
  $schema?: string;
  /**
   * Must be set to json2ts.
   */
  $tool: string;
  /**
   * Input json files(Glob), relative to the pwd.
   */
  src: string[];
  /**
   * The output file path (relative to the pwd), support .ts file.
   */
  dist: string;
}

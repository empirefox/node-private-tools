export interface GoTagApisConfig {
  $schema?: string;
  $tool: string;
  /**
   * Input go files(Glob), expand with env first
   */
  src: string[];
  /**
   * Go struct names to parse.
   */
  structs: string[];
  /**
   * The output path (relative to the pwd).
   */
  outDir?: string;
}

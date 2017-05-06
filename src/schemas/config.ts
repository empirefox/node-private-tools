/**
 * Retrive attributes of arukas.
 */
export interface ArukasConfig {
  $schema?: string;
  /**
   * Must be set to arukas
   */
  $tool: string;
  /**
   * Can be set through ARUKAS_JSON_API_TOKEN env.
   */
  token?: string;
  /**
   * Can be set through ARUKAS_JSON_API_SECRET env.
   */
  secret?: string;
  /**
   * Attribute name to fetch, only support host now.
   */
  attr: "host";
}

/**
 * Generate phone number list
 */
export interface CityMobileSectionsConfig {
  $schema?: string;
  /**
   * Must be set to city-mobile-sections
   */
  $tool: string;
  /**
   * Column name.
   */
  column: ("province" | "city");
  /**
   * Column value.
   */
  value: string;
  /**
   * The output path (relative to the pwd).
   */
  dist: string;
  /**
   * Typeorm driver.
   */
  driver: {
      /**
     * Database type, sync with typeorm.DriverType
     */
  type: ("mysql" | "postgres" | "mariadb" | "sqlite" | "oracle" | "mssql" | "websql");
      /**
     * Database host
     */
  host: string;
      /**
     * Database port
     */
  port: number;
      /**
     * Database username
     */
  username: string;
      /**
     * Database password
     */
  password: string;
      /**
     * Database name to connect to
     */
  database: string;
  };
}

export interface GenericToolConfig {
  $schema?: string;
  /**
   * Tool name to find the tool.
   */
  $tool: string;
  [k: string]: any;
}

export interface GoConstTsConfig {
  $schema?: string;
  /**
   * Must be set to go-const-ts.
   */
  $tool: string;
  /**
   * Input go files(Glob), expand with env first.
   */
  src: string[];
  /**
   * The output root path (relative to the pwd).
   */
  dist: string;
  /**
   * Langs to exrtact. Field name will be used if lang not set in go const.
   */
  langs: string[];
  /**
   * Include const types only, ignore others.
   */
  includeTypes?: string[];
  /**
   * Exclude const types.
   */
  excludeTypes?: string[];
  /**
   * Dirs that contains the translated jsons which will overwrite the go const types.
   */
  prettiesRoots?: string[];
  /**
   * Dirs that contains the translated jsons which will overwrite the go const types.
   */
  pretties?: {
  
  };
  /**
   * Prefix to pipe name, pipe name is used as file name.
   */
  pipePrefix: string;
}

export interface GoTagApisConfig {
  $schema?: string;
  /**
   * Must be set to go-tag-apis.
   */
  $tool: string;
  /**
   * Input go files(Glob), expand with env first.
   */
  src: string[];
  /**
   * Go struct names to parse.
   */
  structs: string[];
  /**
   * The output dir path (relative to the pwd).
   */
  dist: string;
}

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

export interface Kuaidi100Config {
  $schema?: string;
  /**
   * Must be set to kuaidi100.
   */
  $tool: string;
  /**
   * The output file path (relative to the pwd), support .ts .js .json.
   */
  dist: string;
  /**
   * Target source of raw companys info.
   */
  url: string;
}

export interface SvgPatternsConfig {
  $schema?: string;
  /**
   * Must be set to svg-patterns.
   */
  $tool: string;
  /**
   * The output file path (relative to the pwd), support .ts .js .json.
   */
  dist: string;
  /**
   * Target of raw Patterns-Gallery html page.
   */
  url: string;
}

export interface ToMpeg4Config {
  $schema?: string;
  /**
   * Must be set to to-mpeg4.
   */
  $tool: string;
  /**
   * Input go files(Glob), expand with env first. ie ~/movie/non-mp4/&#42;&#42;/&#42;.{mp4,mkv,avi,flv}
   */
  src: string[];
  /**
   * The output dir (relative to the pwd).
   */
  dist: string;
  /**
   * The history dir (relative to the pwd).
   */
  history: string;
  /**
   * Ffmpeg output options, in k-v mode ie '-vf scale=640:360'.
   */
  outputOptions?: string[];
}

export interface ToolsLoaderConfig {
  $schema?: string;
  version: string;
  tasks: (ArukasConfig | CityMobileSectionsConfig | GoConstTsConfig | GoTagApisConfig | Json2TsConfig | Kuaidi100Config | SvgPatternsConfig | ToMpeg4Config | TsTransConfig | GenericToolConfig)[];
  ajv?: {
    [k: string]: any;
  };
  /**
   * Addition RunnerWithSchema[].
   */
  additionRunners?: string[];
}

/**
 * Generate translate from ts interface.
 */
export interface TsTransConfig {
  $schema?: string;
  /**
   * Must be set to ts-trans.
   */
  $tool: string;
  /**
   * Input go files(Glob), expand with env first.
   */
  src: string[];
  /**
   * The output root path (relative to the pwd).
   */
  dist: string;
  /**
   * Field with this tag content will be parsed.
   */
  tag: string;
  /**
   * Langs to exrtact. Field name will be used if lang not set.
   */
  langs: string[];
  /**
   * Prefix to pipe name, pipe name is used as file name.
   */
  pipePrefix: string;
}

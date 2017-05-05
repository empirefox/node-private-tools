// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var VERSION: string;

interface Dict<T> {
  [key: string]: T;
  [key: number]: T;
  // [key: symbol]: T;
}

declare module 'querystringify' {
  export function stringify(obj: any, prefix?: string | boolean): string;
  export function parse(query: string): any;
}

// https://gist.github.com/nertzy/d3110cae677913c476e8b4895eeaf412
declare module 'url-parse' {
  interface Query {
    [index: string]: string;
  }

  interface QueryParser {
    (query: string): any;
  }

  export default class URL {
    constructor(url: string, baseURL?: string, parseQuery?: boolean | QueryParser);

    protocol: string;   // protocol: Requested protocol without slashes (e.g. http:).
    username: string;   // username: Username of basic authentication.
    password: string;   // password: Password of basic authentication.
    auth: string;       // auth: Authentication information portion (e.g. username:password).
    host: string;       // host: Host name with port number.
    hostname: string;   // hostname: Host name without port number.
    port: string;       // port: Optional port number.
    pathname: string;   // pathname: URL path.
    query: Query;       // query: Parsed object containing query string, unless parsing is set to false.
    hash: string;       // hash: The "fragment" portion of the URL including the pound-sign (#).
    href: string;       // href: The full URL.

    toString(): string;
    set(key: string, value: string | Object | number): URL;
  }
}

declare module 'timeago.js' {
  export default class Timeago {
    constructor(nowDate: string, defaultLocale: string);
    format(value: Date | number, locale?: string): string;
  }
}
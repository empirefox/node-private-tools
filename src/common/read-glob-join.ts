import { readFileSync } from 'fs';

const globby = require('globby');

export function readGlobJoin(src: string[], join = '\n'): Promise<string> {
  return (<Promise<string[]>>globby(src)).then(paths => {
    return Promise.all(paths.map(async path => await readFileSync(path, 'utf8'))).then(contents => contents.join(join));
  });
}

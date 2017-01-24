import { processString } from "typescript-formatter";

const {writeFileSync} = require('fs-plus');

export function formateWrite(fileName: string, content: string) {
  return processString(fileName, content, {
    dryRun: true,
    replace: true,
    verify: false,
    tsconfig: true,
    tslint: true,
    editorconfig: true,
    tsfmt: true
  }).then(result => {
    if (result.error) {
      console.error(result.message);
    } else {
      writeFileSync(fileName, result.dest, { encoding: 'utf8' });
    }
  });
}
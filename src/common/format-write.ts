import { processString } from 'typescript-formatter';

const { writeFileSync } = require('fs-plus');

export function formateWrite(fileName: string, content: string) {
  return processString(fileName, content, {
    dryRun: true,
    replace: false,
    verify: false,
    tsconfig: true,
    tsconfigFile: null,
    tslint: true,
    tslintFile: null,
    editorconfig: true,
    vscode: true,
    tsfmt: true,
    tsfmtFile: null,
  }).then(
    result => {
      if (result.error) {
        console.error('formateWrite failed', result.message);
      } else {
        writeFileSync(fileName, result.dest, { encoding: 'utf8' });
      }
    },
    console.error.bind(console),
  );
}
import { readFileSync } from 'fs';
import { usage } from 'yargs';
import { writeFile } from '../common';

const {writeFileSync} = require('fs-plus');

let argv = usage('Usage: $0 [options]')
  .example('$0 -o api.ts -i api.go -s Apis', 'generate api from golang')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file, support .ts',
      demand: true,
      coerce: (arg: string) => /\.ts$/.test(arg) ? arg : `${arg}.ts`,
    },
    i: {
      alias: 'in',
      nargs: 1,
      describe: 'input file, support .go',
      default: 'api.go',
    },
    s: {
      alias: 'struct',
      nargs: 1,
      default: 'Apis',
    },
    p: {
      alias: 'prefix',
      nargs: 1,
      describe: 'prefix of url',
      default: '${environment.apiOrigin}',
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

let structRe = new RegExp(`type ${argv.s} struct \{([^\}]+)\}`);
let structMatch = readFileSync(argv.i, 'utf8').match(structRe);
if (!structMatch) {
  console.log(`struct ${argv.s} not found`);
  process.exit(-1);
} else {
  let match: RegExpExecArray | null;
  let re = /\s*(\w+)\s*.+default\:"([^"]+)"/g;
  let apis: string[] = [];
  while (match = re.exec(structMatch[1])) {
    let p: string[] = [];
    let u = match[2].replace(/\/\:(\w+)/, (m: string) => {
      m = m.slice(2);
      p.push(m);
      return `/\${${m}}`
    });
    u = '`${apiOrigin}' + u + '`';
    if (p.length) {
      u = `(${p.join()}: any) => ${u}`;
    }
    apis.push(`${match[1]}: ${u},`);
  }

  let content = `export function apis(apiOrigin: string) {
  return {
    ${apis.join('\n    ')}
  };
}`;
  writeFileSync(argv.o, content, { encoding: 'utf8' });
}

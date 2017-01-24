import { readFileSync } from 'fs';
import { usage } from 'yargs';
import { processString } from "typescript-formatter";
import { formateWrite } from '../common';

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
  // key, value, comment?
  let re = /^(\w+)\s+string\s+`\s*default\:"([^"]+)"\s*`(?:\s*(\/\/.*))?/;
  let commentRe = /\/\/(.*)/;
  let lines = structMatch[1].split('\n').map(line => {
    line = line.trim();
    let match = line.match(re);
    if (match) {
      let p: string[] = [];
      // replace params
      let u = match[2].replace(/\/\:(\w+)/, (m: string) => {
        m = m.slice(2);
        p.push(m);
        return `/\${${m}}`
      });
      u = '`${apiOrigin}' + u + '`';
      if (p.length) {
        u = `(${p.join()}: any) => ${u}`;
      }
      let comment = match[3] ? `  ${match[3]}` : ''
      return `${match[1]}: ${u},${comment}`;
    } else {
      return line.match(commentRe) ? line : '';
    }
  });

  let content = `// Generated by node-private-tools
export function apis(apiOrigin: string) {
  return {
    ${lines.join('\n')}
  };
}`;
  formateWrite(argv.o, content);
}

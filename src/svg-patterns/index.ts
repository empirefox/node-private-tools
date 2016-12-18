import { parse } from './parse';
import { usage } from 'yargs';
import { writeFile } from '../common';

let argv = usage('Usage: $0 [options]')
  .example('$0 -o coms.json', 'generate svg patterns list')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file, support .js .json',
      demand: true,
      coerce: (arg: string) => /\.(ts|js|json)$/.test(arg) ? arg : `${arg}.json`,
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

parse().then(svgs => writeFile(argv.o, svgs));

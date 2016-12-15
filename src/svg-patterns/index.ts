import { parse } from './parse';
import { usage } from 'yargs';
import { writeFileSync } from 'fs';

let argv = usage('Usage: $0 [options]')
  .example('$0 -o coms.json', 'generate svg patterns list')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file, support .js .json',
      demand: true,
      coerce: (arg: string) => /\.js(on)?$/.test(arg) ? arg : `${arg}.json`,
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

parse().then(svgs => {
  let content = JSON.stringify(svgs, null, '\t');
  if ((<string>argv.o).endsWith('js')) {
    content = `export const patterns = ${content};`;
  }

  writeFileSync(argv.o, content, { encoding: 'utf8' });
  process.stdout.write('done!\n');
});

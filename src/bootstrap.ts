import { readFileSync } from 'fs';
import { usage } from 'yargs';

import {
  ToolsLoader,
  Arukas,
  CityMobileSections,
  GoConstTs,
  GoTagApis,
  Json2ts,
  Kuaidi100,
  SvgPatterns,
  ToMpeg4,
  TsTrans,
} from './runners';

const RUNNERS = [
  Arukas,
  CityMobileSections,
  GoConstTs,
  GoTagApis,
  Json2ts,
  Kuaidi100,
  SvgPatterns,
  ToMpeg4,
  TsTrans,
];

const argv = usage('Usage: $0 [options]')
  .example('$0 -c .nptconfig.json', 'Run node-private-tools tasks.')
  .options({
    c: {
      alias: 'config',
      nargs: 1,
      describe: 'Config file',
      default: '.nptconfig.json',
      coerce: (arg: string) => JSON.parse(readFileSync(arg, 'utf8')),
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const loaderConfig = argv.c;

if (VERSION !== loaderConfig.version) {
  console.warn(`Your config version is ${loaderConfig.version}, but loader version is ${VERSION}!`);
}

const loader = new ToolsLoader(loaderConfig);
RUNNERS.forEach(runner => loader.registry(runner.forLoader()));

const errors = loader.validate();
if (errors) {
  console.error(errors);
  process.exit(1);
}

// console.log(JSON.stringify(loaderConfig, null, '\t'))

loader.run().then(
  _ => console.log('done'),
  err => console.error(err),
);

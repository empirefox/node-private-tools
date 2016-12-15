import { usage } from 'yargs';
import { DriverOptions } from "typeorm";

export interface Args {
  out: string;
  column: 'province' | 'city';
  param: string;
  driver: DriverOptions;
}

let yargs = usage('Usage: $0 [options]')
  .example(
  `$0 \\
  -o num.txt \\
  -p "sc" \\
  -d ~/typeorm-driver.json`, 'generate mobile section list of a place')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file',
      demand: true,
    },
    p: {
      alias: 'province',
      nargs: 1,
      describe: 'short province name',
    },
    c: {
      alias: 'city',
      nargs: 1,
      describe: 'short city name',
    },
    d: {
      alias: 'driver',
      nargs: 1,
      describe: 'driver .json file of typeorm',
      coerce: (arg: string) => arg ? require(arg) : {},
    },
    'driver-type': { nargs: 1, desc: 'that typeorm support' },
    'driver-host': { nargs: 1, desc: 'that typeorm support' },
    'driver-port': { nargs: 1, desc: 'that typeorm support' },
    'driver-username': { nargs: 1, desc: 'that typeorm support' },
    'driver-password': { nargs: 1, desc: 'that typeorm support' },
    'driver-database': { nargs: 1, desc: 'that typeorm support' },
  })
  .help('h')
  .alias('h', 'help');

let argv: any = yargs.argv;

let column: 'province' | 'city' = 'city';
let param = '';
if (argv.c) {
  column = 'city';
  param = argv.c;
} else if (argv.p) {
  column = 'province';
  param = argv.p;
} else {
  console.error('option p or c must be set');
  yargs.showHelp();
  process.exit(0);
}

let driver: DriverOptions = argv.d || {};
'type,host,port,username,password,database'.split(',').forEach(key => {
  let value: string = argv[`driver-${key}`];
  if (value) {
    (<any>driver)[key] = value;
  }
});

export const args: Args = { out: argv.o, column, param, driver };

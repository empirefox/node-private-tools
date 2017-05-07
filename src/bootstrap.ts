import { readFileSync } from 'fs';
import { usage } from 'yargs';

import { RunnerWithSchema } from './common';
import { ToolsLoaderConfig } from './schemas';
import { ToolsLoader, RUNNERS } from './runners';

export function bootstrap(loaderConfig: ToolsLoaderConfig, additionRunners: RunnerWithSchema[]): Promise<any>{
  if (VERSION !== loaderConfig.version) {
    console.warn(`Your config version is ${loaderConfig.version}, but loader version is ${VERSION}!`);
  }

  const runners = [...new Set([
    ...additionRunners,
    ...(loaderConfig.additionRunners || []).map(item => require(item)),
    ...RUNNERS.map(runner => runner.forLoader()),
    ])];
  const loader = new ToolsLoader(loaderConfig);
  runners.forEach(runner => loader.registry(runner));

  const errors = loader.validate();
  // console.log(JSON.stringify(loaderConfig, null, '\t'))
  return errors? Promise.reject(errors): loader.run();
}

export function bootstrapFromCli(additionRunners: RunnerWithSchema[] = []): Promise<any> {
  const { c: loaderConfig }: { c: ToolsLoaderConfig } = usage('Usage: $0 [options]')
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

    return bootstrap(loaderConfig, additionRunners);
}

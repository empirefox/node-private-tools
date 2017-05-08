import { normalize } from 'path';
import { pwd } from 'shelljs'
import { usage } from 'yargs';

import { reqCwd, RunnerWithSchema } from './common';
import { ToolsLoaderConfig } from './schemas';
import { ToolsLoader, RUNNERS } from './runners';

const cosmiconfig = require('cosmiconfig');
const chalk = require('chalk');

export function bootstrap(loaderConfig: ToolsLoaderConfig, additionRunners: RunnerWithSchema[]): Promise<any> {
  if (VERSION !== loaderConfig.version) {
    console.warn(`Your config version is ${loaderConfig.version}, but loader version is ${VERSION}!`);
  }

  const runners = [...new Set([
    ...additionRunners,
    ...(loaderConfig.additionRunners || []).map(item => reqCwd(item)),
    ...RUNNERS.map(runner => runner.forLoader()),
  ])];
  const loader = new ToolsLoader(loaderConfig);
  runners.forEach(runner => loader.registry(runner));

  const errors = loader.validate();
  return errors ? Promise.reject(errors) : loader.run();
}

const cosmiconfigOptions = {
  argv: false,
  rcExtensions: true,
};

export function bootstrapFromCli(additionRunners: RunnerWithSchema[] = []): Promise<any> {
  const argv = usage('Usage: $0 [options]')
    .example('$0 -c npt.config.test.js', `
      Run node-private-tools tasks. If config option is not set, try to follow the finding order blow:

            npt property in a package.json file.
            .nptrc(.json|.yml) file with JSON or YAML syntax.
            npt.config.js JS file exporting the object.`)
    .options({
      c: {
        alias: 'config',
        nargs: 1,
        describe: 'Config file path.',
      }
    })
    .help('h')
    .alias('h', 'help');

  let configPath = argv.argv.c;
  const searchPath = configPath ? null : pwd().toString();
  configPath = configPath ? normalize(configPath) : undefined;

  const load: Promise<{ config: any, filepath: string }> = cosmiconfig('npt', cosmiconfigOptions).load(searchPath, configPath);
  return load.then(({ config, filepath }) => {
    console.log(chalk.yellow(`Loading config from ${filepath}`));
    return bootstrap(config, additionRunners);
  }).catch(err => {
    if (configPath) {
      console.log(chalk.yellow(`Error loading ${configPath}:`));
      console.log(err);
    } else {
      argv.showHelp();
    }
    return Promise.reject('Failed');
  });
}

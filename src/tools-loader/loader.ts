import { template } from 'lodash';
import { argv } from 'yargs';
import { Options, Ajv as AjvType, ValidateFunction, ErrorObject } from 'ajv';
import * as Ajv from 'ajv';
import ora = require('ora');

import { Runner, RunnerConstructor, RunnerWithSchema } from '../common';
import { ToolsLoaderConfig, GenericToolConfig } from '../schemas/config';

const { normalize } = require('fs-plus');

const defaultAjv = {
  useDefaults: true,
};

function expand(tplData, data, dataPath, parentData, parentDataProperty) {
  parentData[parentDataProperty] = normalize(template(data)(tplData));
}

const tplDatas = {
  env: process.env,
  yargs: argv,
};

export class ToolsLoader {
  ajv: AjvType;
  tools = new Map<string, RunnerConstructor>();

  constructor(private loaderConfig: ToolsLoaderConfig) {
    const ajvOptions = Object.assign({}, defaultAjv, loaderConfig.ajv);
    const ajv = this.ajv = new Ajv(ajvOptions);

    ajv.addKeyword('expand', {
      type: ['string'],
      valid: true,
      modifying: true,
      compile: (sch, parentSchema) => (data, dataPath, parentData, parentDataProperty) => {
        const tplData = tplDatas[sch];
        if (!tplData) {
          return false;
        }
        expand(tplData, data, dataPath, parentData, parentDataProperty);
        return true;
      }
    });

    ajv.addSchema(require('../schemas/tools-loader.json'), 'tools-loader');
    ajv.addSchema(require('../schemas/generic-tool.json'), 'generic-tool');
  }

  registry({ $tool, schema, runner, keywords, formats }: RunnerWithSchema) {
    this.tools.set($tool, runner);
    this.ajv.addSchema(schema, $tool);
    if (keywords) {
      keywords.forEach(item => this.ajv.addKeyword(item.keyword, item.define));
    }
    if (formats) {
      formats.forEach(item => this.ajv.addFormat(item.format, item.define));
    }
  }

  create(config: { $tool: string }): Runner {
    const LoaderClass = this.tools.get(config.$tool);
    if (!LoaderClass) {
      throw new Error(`$tool('${config.$tool}') not found`);
    }
    return new LoaderClass(config);
  }

  validate(): ErrorObject[] | undefined {
    const validate = this.ajv.getSchema('tools-loader');
    // separate tasks
    const tasks = this.loaderConfig.tasks;
    this.loaderConfig.tasks = [];
    const valid = validate(this.loaderConfig);
    this.loaderConfig.tasks = tasks;
    if (!valid) {
      return validate.errors;
    }

    // validate tasks
    const errors = tasks.map(task => {
      const validate = this.ajv.getSchema(task.$tool);
      const valid = validate(task);
      return validate.errors || [];
    }).reduce((a, b) => [...a, ...b], []);

    return errors.length ? errors : undefined;
  }

  run(): Promise<any> {
    const spinner = ora('Node-private-tools starting');
    const length = this.loaderConfig.tasks.length;
    return this.loaderConfig.tasks
      .map(task => this.create(task))
      .reduce((cur, next, index) => {
        return cur.then(() => {
          spinner.color = 'yellow';
          spinner.text = `(${index + 1}/${length}) Running ${next.config.$tool} `;
          spinner.start();
          return next.run().then(
            () => {
              spinner.color = 'green';
              spinner.text = `(${index + 1}/${length}) ${next.config.$tool} completed `;
              spinner.succeed();
            },
            err => {
              spinner.color = 'cyan';
              spinner.text = `(${index + 1}/${length}) ${next.config.$tool} failed `;
              spinner.fail();
              return Promise.reject(err);
            });
        });
      }, Promise.resolve())
      .then(() => {
        spinner.color = 'green';
        spinner.text = `done `;
        spinner.succeed();
      });
    // return Promise.resolve()
  }

}

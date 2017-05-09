import axios from 'axios';

import { Runner, RunnerWithSchema } from '../common';
import { ArukasConfig } from '../schemas';

const env = <{ ARUKAS_JSON_API_TOKEN: string, ARUKAS_JSON_API_SECRET: string }>process.env;

export class Arukas implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'arukas',
      schema: require('../schemas/arukas.json'),
      runner: Arukas,
    };
  }

  constructor(public config: ArukasConfig) { }

  run(): Promise<any> {
    return axios.get('https://app.arukas.io/api/containers', {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      auth: {
        username: this.config.token || env.ARUKAS_JSON_API_TOKEN,
        password: this.config.secret || env.ARUKAS_JSON_API_SECRET,
      },
    }).then(res => {
      const portMapping = res.data.data[0].attributes.port_mappings[0][0];
      const ip = portMapping.host.slice(6, portMapping.host.indexOf('.jp', 6)).replace(/-/g, '.');
      const result: any = {};
      switch (this.config.attr) {
        case 'host':
          result.host = `${ip}:${portMapping.service_port}`;
          break;
      }
      console.log();
      console.log(JSON.stringify(result, null, ' '));
      return result;
    });
  }

}

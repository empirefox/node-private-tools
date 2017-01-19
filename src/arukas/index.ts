import axios from 'axios';
import { usage } from 'yargs';
import { writeFile } from '../common';

const env = <{ ARUKAS_TOKEN: string, ARUKAS_SECRET: string }>process.env;

let argv = usage('Usage: $0 [options]')
  .example('$0 -a host', 'retrive tcp host:port of arukas')
  .env('ARUKAS')
  .options({
    a: {
      alias: 'attribute',
      nargs: 1,
      demand: true,
      choices: ['host'],
    },
    t: {
      alias: 'token',
      nargs: 1,
      coerce: (arg: string) => arg ? arg : env.ARUKAS_TOKEN,
    },
    s: {
      alias: 'secret',
      nargs: 1,
      coerce: (arg: string) => arg ? arg : env.ARUKAS_SECRET,
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

axios.get('https://app.arukas.io/api/containers', {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  },
  auth: {
    username: argv.t,
    password: argv.s,
  },
}).then(res => {
  let portMapping = res.data.data[0].attributes.port_mappings[0][0];
  let ip = portMapping.host.slice(6, portMapping.host.indexOf(".jp", 6)).replace(/-/g, '.');
  portMapping.addr = `${ip}:${portMapping.service_port}`;
  portMapping.host = `${portMapping.host}:${portMapping.service_port}`;
  console.log(JSON.stringify(portMapping, null, ' '));
});

const stringifyObject = require('stringify-object');
const {writeFileSync} = require('fs-plus');

const stringifyOpts = {
  indent: ' ',
  singleQuotes: true,
  inlineCharacterLimit: 12,
};

export function writeFile(out: string, json: any) {
  let content = out.endsWith('json') ? JSON.stringify(json, null, '\t') : stringifyObject(json, stringifyOpts);
  if (out.endsWith('ts')) {
    content = `export = ${content};`;
  } else if (out.endsWith('js')) {
    content = `module.exports = ${content};`;
  }

  writeFileSync(out, content, { encoding: 'utf8' });
  process.stdout.write('done!\n');
}

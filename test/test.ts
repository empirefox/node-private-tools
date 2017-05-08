/* tslint:disable */
import { format } from 'date-fns';
import * as Ajv from 'ajv';

const chalk = require('chalk');

const re: { [k: string]: any; } = /aa/g;

const proccessors = {
  regexp: (data, dataPath, parentData, parentDataProperty) => {
    if (data instanceof RegExp) {
      return true;
    }
    const flags = data.replace(/.*\/([gimy]*)$/, '$1');
    const pattern = data.replace(new RegExp(`^/(.*?)/${flags}$`), '$1');
    console.log(pattern, flags)
    try {
      parentData[parentDataProperty] = new RegExp(pattern, flags);
      return true;
    } catch (error) {
      console.error(chalk.red(`Error creating RegExp from '${data}' parameter:`));
      console.error(error);
      return false;
    }
  },
};

var ajv = new Ajv({ useDefaults: true });

ajv.addKeyword('preproccess', {
  type: ['string'],
  valid: true,
  modifying: true,
  compile: (sch, parentSchema) => (data, dataPath, parentData, parentDataProperty) => {
    if (sch in proccessors) {
      return proccessors[sch](data, dataPath, parentData, parentDataProperty);
    }
    return false;
  }
});

var schema = {
  "type": "object",
  "properties": {
    "foo": { "type": "number" },
    "bar": {
      "type": "object",
      "properties": {
        "a": {
          type: 'string',
          default: 'baz'
        },
      },
      default: {}
    },
    "from": {
      "description": "Regexp(s) to find from files.",
      "oneOf": [
        {
          "type": "string",
          "preproccess": "regexp"
        },
        {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "preproccess": "regexp"
          }
        }
      ]
    },
  },
  "required": ["foo", "bar"]
};

var data = { "foo": 1, from: '/^foo/g' };

var validate = ajv.compile(schema);

console.log(validate(data)); // true
console.log(data); // { "foo": 1, "bar": "baz" }
console.log((<any>data.from) instanceof RegExp); // true
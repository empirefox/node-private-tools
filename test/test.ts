
import { format } from 'date-fns';
import * as Ajv from 'ajv';

console.log(format(new Date(), 'YYMMDD.log'))

var ajv = new Ajv({ useDefaults: true });
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
        }
      },
      default: {}
    }
  },
  "required": ["foo", "bar"]
};

var data = { "foo": 1 };

var validate = ajv.compile(schema);

console.log(validate(data)); // true
console.log(data); // { "foo": 1, "bar": "baz" }
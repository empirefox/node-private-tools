class TestTool {
  constructor(config) {
    this.config = config;
  }
  run() {
    console.log('TestTool OK!!!');
    return Promise.resolve();
  }
}

module.exports = {
  $tool: 'test-tool',
  schema: {
    "$schema": "http://json-schema.org/schema",
    "id": "https://github.com/empirefox/node-private-tools/blob/master/src/schemas/test-tool.json#",
    "title": "test-tool Config",
    "properties": {
      "$schema": {
        "type": "string"
      },
      "$tool": {
        "type": "string",
        "description": "Must be set to test-tool",
        "const": "test-tool"
      }
    },
    "required": [
      "$tool"
    ]
  },
  runner: TestTool,
}
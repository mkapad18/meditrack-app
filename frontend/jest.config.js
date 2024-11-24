const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx',,'js', 'jsx'],
  testEnvironment: 'node',
  serialize: (obj) => JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return; // Circular reference found, discard key
      }
      seen.add(value);
    }
    return value;
  }),
};
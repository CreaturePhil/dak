const compareTypes = require('./compareTypes');

function arrayType(valueType, typeDef, contents, value) {
  const cmp = compareTypes('Array', typeDef.types[0], value);
  if (cmp.result) {
    return [{
      check: 'success',
      name: typeDef.name
    }];
  } else {
    return [{
      check: 'error',
      comment: typeDef.comment,
      name: typeDef.name,
      actual: `[${cmp.actual}]`,
      expected: typeDef.types[0],
      isVariable: true
    }];
  }
}

module.exports = arrayType;

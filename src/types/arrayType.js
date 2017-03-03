const getType = require('./getType');

function times(n, s) {
  let buf = '';
  while (n--) {
    buf += s;
  }
  return buf;
}

function arrayType(valueType, typeDef, contents, value) {
  const arraySugarSyntax = typeDef.types[0];
  let nested = 0;
  for (let i = 0; i < arraySugarSyntax.length; i++) {
    if (arraySugarSyntax[i] === '[') {
      nested++;
    } else {
      break;
    }
  }
  const type = arraySugarSyntax.slice(nested, -nested);
  if (value.length === 0 || (type === 'a' && value.length === 1)) {
    return [{
      check: 'success',
      name: typeDef.name
    }];
  }
  const actualType = getType(value[0]);
  // NOTE: need to check for object
  if (actualType !== type) {
    return [{
      check: 'error',
      comment: typeDef.comment,
      name: typeDef.name,
      actual: `[${actualType}]`,
      expected: arraySugarSyntax,
      isVariable: true
    }];
  }
  let res;
  if (value.length >= 2) {
    let prev;
    value.map(v => getType(v)).forEach(vType => {
      if (!prev) {
        prev = vType
      } else if (prev !== vType) {
        res = [{
          check: 'error',
          comment: typeDef.comment,
          name: typeDef.name,
          actual: `[${vType}]`,
          expected: arraySugarSyntax,
          isVariable: true
        }];
      }
    });
  }
  if (res) {
    return res;
  } else {
    return [{
      check: 'success',
      name: typeDef.name
    }];
  }
}

module.exports = arrayType;

const getType = require('./getType');

const contents = `
  const String = 'String';
  const Boolean = 'Boolean';
  const Number = 'Number';
  const Null =  'Null';
  const Undefined = 'Undefined';
`;

function compareTypes(a, b, value) {
  if (a === b) {
    return {result: true};
  }
  if (a === 'Array' || b === 'Array') {
    let nested = 0;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === '[') {
        nested++;
      } else {
        break;
      }
    }
    const type = b.slice(nested, -nested);
    if (value.length === 0 || (type === 'a' && value.length === 1)) {
      return {result: true};
    }
    const actualType = getType(value[0]);
    if (actualType === 'Object') {
      return compareObjectType(value[0], b);
    }
    if (actualType !== type) {
      return {result: false, actual: actualType};
    }
    let res;
    if (value.length >= 2) {
      let prev;
      value.map(v => getType(v)).forEach(vType => {
        if (!prev) {
          prev = vType;
        } else if (prev !== vType) {
          res = {result: false, actual: vType};
          return;
        }
      });
      return res;
    }
  }
  if (a === 'Object' || b === 'Object') {
    return compareObjectType(value, b);
  }
  return {result: false, actual: a};
}

function getObjectType(obj) {
  return Object.keys(obj).reduce((acc, cur) => {
    const type = getType(obj[cur]);
    if (type !== 'Object') {
      acc[cur] = type;
      return acc;
    } else {
      acc[cur] = getObjectType(obj[cur]);
      return acc;
    }
  }, {});
}

function compareObjectType(a, b) {
  const t = getObjectType(a);
  let o;
  eval(contents + `\no = ${b}`);
  const keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (t[key] !== o[key]) {
      return {result: false, actual: `${t[key]} for the key "${key}"`};
    }
  }
  return {result: true};
}

module.exports = compareTypes;

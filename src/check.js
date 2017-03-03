// @dak

const arrayType = require('./types/arrayType');
const functionType = require('./types/functionType');
const getType = require('./types/getType');
const primitiveType = require('./types/primitiveType');

const Types = new Map([
  ['Boolean', primitiveType],
  ['Number', primitiveType],
  ['String', primitiveType],
  ['Null', primitiveType],
  ['Undefined', primitiveType],
  ['Function', functionType],
  ['Array', arrayType]
]);

  // 'Array',
  // 'Object',
  // 'String',
  // 'Date',
  // 'RegExp',
  // 'Function',
  // 'Boolean',
  // 'Number',
  // 'Null',
  // 'Undefined'


// NOTE: may need to replace === with custm evalulator for arrays and objects!

function check(contents, typeDefs) {
  const results = typeDefs.map(typeDef => {
    let value;
    eval(contents + `\nvalue = ${typeDef.name};\n`);

    const valueType = getType(value);
    const isVariable = valueType === typeDef.types[0];

    if (isVariable) {
      return {check: 'success', name: typeDef.name};
    }

    return Types.has(valueType) ?
      Types.get(valueType)(valueType, typeDef, contents, value) : {};
  });

  return flatten(results);
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

module.exports = check;

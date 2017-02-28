// @dak

const getFunctionArgs = require('./getFunctionArgs');
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


function primitiveType(valueType, typeDef) {
  return valueType === typeDef.types[0] ?
  {
    check: 'success',
    name: typeDef.name
  } :
  {
    check: 'error',
    comment: typeDef.comment,
    name: typeDef.name,
    actual: valueType,
    expected: typeDef.types[0]
  };
}


const Types = new Map([
  ['Boolean', primitiveType],
  ['Number', primitiveType],
  ['String', primitiveType],
  ['Null', primitiveType],
  ['Undefined', primitiveType]
]);

// getType :: a -> String
function getType(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
}

function check(contents, typeDefs) {
  return typeDefs.map(typeDef => {
    let value;
    eval(contents + `\nvalue = ${typeDef.name};\n`);

    const valueType = getType(value);
    const isVariable = valueType === typeDef.types[0];

    if (isVariable) {
      return {check: 'success', name: typeDef.name};
    }

    return Types.has(valueType) ? Types.get(valueType)(valueType, typeDef) : {};

    // if (type === 'number' || type === 'string' || type === 'boolean') {
    //   if (type !== typeDef[1]) {
    //     console.error(`${name}: Expected type '${typeDef[1]}' but got type '${type}'`);
    //   }
    // }
    // if (type === 'function') {
    //   // should probably move this to parse function?
    //   const typeParams = typeDef[1].split('->').map(t => t.trim());
    //   contents
    //     .match(new RegExp(name + '\(.*\);', 'g'))
    //     .forEach(expr => {
    //       const nsParam = '_dak_G' + count++;
    //       eval(contents + `\nns.${nsParam} = ${expr}\n`);
    //       getFunctionArgs(name, expr)
    //         .forEach((e, i) => {
    //           if (typeof e !== typeParams[i]) {
    //             console.error(`Param: ${name}: Expected type '${typeParams[i]}' but got type '${typeof e}'`);
    //           }
    //         });
    //
    //       if (ns[nsParam] !== typeDef[1]) {
    //         console.error(`${name}: Expected type '${typeParams[typeParams.length - 1]}' but got type '${typeof ns[nsParam]}'`);
    //       }
    //     });
    // }
  });
}

module.exports = check;

// @dak

const Types = new Map([
  ['Boolean', primitiveType],
  ['Number', primitiveType],
  ['String', primitiveType],
  ['Null', primitiveType],
  ['Undefined', primitiveType],
  ['Function', functionType]
]);

// getType :: a -> String
function getType(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
}

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
  [{
    check: 'success',
    name: typeDef.name
  }] :
  [{
    check: 'error',
    comment: typeDef.comment,
    name: typeDef.name,
    actual: valueType,
    expected: typeDef.types[0],
    isVariable: true
  }];
}

// NOTE: may need to replace === with custm evalulator for arrays and objects!

function functionType(valueType, typeDef, contents) {
  return getFnCalls(contents, typeDef)
    .map(fnCall => {
      const argsResults = getFunctionArgs(fnCall.line)
        .map((arg, i) => {
          const argType = getType(arg);
          if (argType === typeDef.types[i]) {
            return {check: 'success', name: typeDef.name, arg};
          } else {
            return {
              check: 'error',
              comment: typeDef.comment,
              name: typeDef.name,
              actual: argType,
              expected: typeDef.types[i],
              line: fnCall.line,
              lineNumber: fnCall.lineNumber,
              isArg: true
            };
          }
        });

      let returnValue;
      eval(contents + `\nreturnValue = ${fnCall.line}\n`);
      const returnValueType = getType(returnValue);
      const expectedType = typeDef.types[typeDef.types.length - 1];

      if (returnValueType === expectedType) {
        return argsResults.concat({
          check: 'success',
          name: typeDef.name,
          returnValue
        });
      } else {
        return argsResults.concat({
          check: 'error',
          comment: typeDef.comment,
          name: typeDef.name,
          actual: returnValueType,
          expected: expectedType,
          line: fnCall.line,
          lineNumber: fnCall.lineNumber,
          isReturn: true
        });
      }
    });
}

// @type getFunctionArgs :: String -> [a]
function getFunctionArgs(f) {
  let args = [];
  eval(`
    function ${f.slice(0, f.indexOf('('))}() {
      args = Array.prototype.slice.call(arguments);
    }
    ${f}
  `);
  return args;
}

function getFnCalls(contents, typeDef) {
  const lines = contents.split('\n');
  const WHITESPACE = /\s/;
  const FNCALL = new RegExp(typeDef.name + '\(.*\)');
  let fnCalls = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    let line = lines[i].trim();
    if (line.slice(0, 2) === '//') continue;
    if (line.slice(0, 8) === 'function') continue;
    if (line.slice(0, 3) === 'let' || line.slice(0, 3) === 'var') continue;
    if (line.slice(0, 5) === 'const') continue;
    if (FNCALL.test(line)) {
      fnCalls.push({line, lineNumber: i});
    }
  }
  return fnCalls;
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

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
      Types.get(valueType)(valueType, typeDef, contents) : {};
  });

  return flatten(results);
}

module.exports = check;

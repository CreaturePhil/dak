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
      const argsResults = getFunctionArgs(fnCall.call, contents)
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
      eval(contents + `\nreturnValue = ${fnCall.call}\n`);
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

// @type getFunctionArgs :: String -> String -> [a]
function getFunctionArgs(f, contents) {
  let args = [];
  eval(contents + `
    function ${f.slice(0, f.indexOf('('))}() {
      args = Array.prototype.slice.call(arguments);
    }
    ${f}
  `);
  return args;
}

function parenMatchEnough(fnCall) {
  let parens = 0, start = false;
  for (let i = 0; i <  fnCall.length; i++) {
    if (fnCall[i] === ')' && !parens) {
      return fnCall.slice(0, i + 1);
    }
    if (fnCall[i] === '(' && !start) {
      start = true;
    } else if (fnCall[i] === '(') {
      parens++;
    } else if (fnCall[i] === ')') {
      parens--;
    }
  }
}

function getFnCalls(contents, typeDef) {
  const lines = contents.split('\n');
  const FNCALL = new RegExp(typeDef.name + '\\(.*\\)');
  let fnCalls = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    let line = lines[i].trim();
    if (line.slice(0, 2) === '//') continue;
    if (line.indexOf('function') >= 0) continue;
    if (FNCALL.test(line)) {
      fnCalls.push({line, call: parenMatchEnough(line.match(FNCALL)[0]), lineNumber: i});
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

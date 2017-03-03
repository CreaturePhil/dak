const getType = require('./getType');
const compareTypes = require('./compareTypes');

function functionType(valueType, typeDef, contents) {
  return getFnCalls(contents, typeDef)
    .map(fnCall => {
      const argsResults = getFunctionArgs(fnCall.call, contents)
        .map((arg, i) => {
          const argType = getType(arg);
          const cmp = compareTypes(argType, typeDef.types[i], arg);
          if (cmp.result) {
            return {check: 'success', name: typeDef.name, arg};
          } else {
            return {
              check: 'error',
              comment: typeDef.comment,
              name: typeDef.name,
              actual: cmp.actual,
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

      const cmp = compareTypes(returnValueType, expectedType, returnValue);
      if (cmp.result) {
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
          actual: cmp.actual,
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

module.exports = functionType;

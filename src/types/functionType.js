const path = require('path');
const walk = require('walk');

const compareTypes = require('./compareTypes');
const getType = require('./getType');

const options = {
  followLinks: false,
  filters: ['.git', 'node_modules']
};

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

      const returnValue = tryEval(undefined, contents, `\nv = ${fnCall.call}\n`);
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

function tryEval(v, contents, s) {
  try {
    eval(contents + s);
  } catch (e) {
    if (e.message.slice(0, 18) === 'Cannot find module') {
      const fnCalls = getFnCalls(contents, {name: 'require'}, true);
      const walker = walk.walk(process.cwd(), options);

      walker.on("file", function (root, fileStats, next) {
        fnCalls.forEach(fnCall => {
          const arg = getFunctionArgs(fnCall.call, '')[0];
          if (path.basename(arg) + '.js' === fileStats.name) {
            let lines = contents.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i] === fnCall.line) {
                lines[i] = 'var ' + lines[i].split(' ')[1] + `= require('${path.join(root, fileStats.name)}');`;
                break;
              }
            }
            contents = lines.join('\n');
          }
        });
        next();
      });

      walker.on('end', () => {
        try {
          eval(contents + s);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
  return v;
}

// @type getFunctionArgs :: String -> String -> [a]
function getFunctionArgs(f, contents) {
  return tryEval([], contents, `
    function ${f.slice(0, f.indexOf('('))}() {
      v = Array.prototype.slice.call(arguments);
    }
    ${f}
  `);
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

function getFnCalls(contents, typeDef, ignoreFunction) {
  const lines = contents.split('\n');
  const FNCALL = new RegExp(typeDef.name + '\\(.*\\)');
  let fnCalls = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    let line = lines[i].trim();
    if (line.slice(0, 2) === '//') continue;
    if (!ignoreFunction && line.indexOf('function') >= 0) continue;
    if (FNCALL.test(line)) {
      fnCalls.push({line, call: parenMatchEnough(line.match(FNCALL)[0]), lineNumber: i});
    }
  }
  return fnCalls;
}

module.exports = functionType;

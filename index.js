#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const meow = require('meow');

const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm


function parse(contents) {
  const comments = contents.match(commentRegex)
  //console.log(comments);

  if (comments[0].indexOf('@dak') < 0) return;

  return comments
    .slice(1)
    .filter(comment => comment.indexOf('@type') >= 0)
    .map(comment => {
      let typeDef = comment.split('::');
      const last = typeDef.length - 1;

      typeDef[0] = typeDef[0]
        .replace('@type', '')
        .replace('\n', '')
        .replace('/*', '')
        .replace('//', '');

      typeDef[last] = typeDef[last]
        .replace('*/', '')
        .replace('\n', '')
        .toLowerCase();

      return typeDef.map(def => def.trim());
    });
}

function check(contents, typeDefs) {
  let ns = {};
  let count = 0;
  typeDefs.forEach(typeDef => {
    const name = typeDef[0];
    const nsInstance = '_dak_G' + count++;
    eval(contents + `\nns.${nsInstance} = ${name};\n`);

    const type = typeof ns[nsInstance];
    if (type === typeDef[1]) return console.log('Type check it out!');

    if (type === 'number' || type === 'string' || type === 'boolean') {
      if (type !== typeDef[1]) {
        console.error(`${name}: Expected type '${typeDef[1]}' but got type '${type}'`);
      }
    }
    if (type === 'function') {
      const typeParams = typeDef[1].split('->').map(t => t.trim());
      contents
        .match(new RegExp(name + '\(.*\);', 'g'))
        .forEach(expr => {
          const nsParam = '_dak_G' + count++;
          eval(contents + `\nns.${nsParam} = ${expr}\n`);
          getParams(expr)
            .forEach((e, i) => {
              if (typeof e !== typeParams[i]) {
                console.error(`Param: ${name}: Expected type '${typeParams[i]}' but got type '${typeof e}'`);
              }
            })

          if (ns[nsParam] !== typeDef[1]) {
             console.error(`${name}: Expected type '${typeParams[typeParams.length - 1]}' but got type '${typeof ns[nsParam]}'`);
          }
        });
    }
  });
}


function getParams(f) {
  let params = [];
  let param = '';
  let foundOpenParen = false;
  let foundOpenQuote = false;
  let open = false;
  for (let i = 0, len = f.length; i < len; i++) {
    if ('(' === f[i]) {
      foundOpenParen = true;
      continue;
    }

    if (!foundOpenParen) continue;

    if ([']', '}'].indexOf(f[i]) >= 0 || (foundOpenQuote && ['"', "'"].indexOf(f[i]) >= 0)) {
      open = false;
      param += f[i];
      continue;
    }
    if (open) {
      param += f[i];
      continue;
    }
    if (['[', '{', '"', "'"].indexOf(f[i]) >= 0) {
      open = true;
      foundOpenQuote = true;
      param += f[i];
      continue;
    }

    if (',' === f[i] || ')' === f[i]) {
      let val;
      eval('val = ' + param);
      params.push(val);
      param = '';
    } else {
      param += f[i];
    }
  }
  return params;
}

const cli = meow(`
  Usage
  $ dak <file>

  Examples
    $ dak file.js
`);

const p = path.join(process.cwd(), cli.input[0])
fs.readFile(p, 'utf8', (err, data) => {
  data = data.replace(new RegExp('console.log\(.*\);', 'g'), '');
  //console.log(getLineNumber(data, commentRegex));
  const typeDefs = parse(data);
  //console.log(typeDefs)
  check(data, typeDefs);

  //console.log(getParams('foo("yo, dude", [1,2,3], {a: 1, b: 3})'))
})

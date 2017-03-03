#!/usr/bin/env node

const fs = require('fs');
const meow = require('meow');
const path = require('path');

const parse = require('./parse');
const check = require('./check');
const print = require('./print');

const cli = meow(`
  Usage
  $ dak [options] file.js [file.js] [dir]

  Options
    --throw  Throws an error

`);

const consoleLogRegex = new RegExp('console.log\(.*\);', 'g');

function dak(data, file) {
  const contents = data.replace(consoleLogRegex, '');
  const typeDefs = parse(contents);

  if (!typeDefs.length) return;

  const results = check(contents, typeDefs);

  print(data, results, file, cli.flags.throw);
}

function stats(p) {
  return new Promise((res, rej) => {
    fs.stat(p, (err, stats) => {
      if (err) return rej(err);
      res(stats);
    });
  });
}

function readFile(p) {
  return new Promise((res, rej) => {
    fs.readFile(p, 'utf8', (err, data) => {
      if (err) return rej(err);
      res({data, file: path.basename(p)});
    });
  });
}

function readDir(p) {
  return new Promise((res, rej) => {
    fs.readdir(p, (err, files) => {
      if (err) return rej(err);
      const ps = files
        .filter(file => path.extname(file))
        .map(file => readFile(path.join(p, file)));
      Promise.all(ps)
        .then(datas => res({datas, file: path.basename(p)}))
        .catch(err => {
          throw err;
        });
    });
  });
}

const ps = cli.input.map(input => {
  const p = path.join(process.cwd(), input);
  return stats(p)
    .then(stats => {
      if (stats.isDirectory()) {
        return readDir(p);
      } else {
        return readFile(p);
      }
    })
    .catch(err => {
      throw err;
    });
});

Promise.all(ps).then(datas => {
  datas
    .forEach(data => {
      if (Array.isArray(data.datas)) {
        data.datas
          .filter(d => d.data)
          .forEach(d => {
            dak(d.data, d.file);
          });
      } else if (typeof data.data === 'string') {
        dak(data.data, data.file);
      }
    });
}).catch(err => {
  console.error(err);
});

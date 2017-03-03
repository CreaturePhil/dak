#!/usr/bin/env node

const fs = require('fs');
const meow = require('meow');
const path = require('path');
const parse = require('./parse');
const check = require('./check');
const print = require('./print');

const cli = meow(`
  Usage
  $ dak <file>

  Examples
    $ dak file.js
`);

const consoleLogRegex = new RegExp('console.log\(.*\);', 'g');

// check if dir or file

fs.readFile(path.join(process.cwd(), cli.input[0]), 'utf8', (err, data) => {
  // catch errors like no comments etc.
  const contents = data.replace(consoleLogRegex, '');
  const typeDefs = parse(contents);
  const results = check(contents, typeDefs);
  //console.log(results);

  print(data, results, cli.input[0]);
});

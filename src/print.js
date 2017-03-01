const colors = require('colors');

function print(data, results) {
  const lines = data.split('\n');
  const length = lines.length;

  const errors = results
    .filter(r => r.hasOwnProperty('check') && r.check === 'error');

  errors.forEach(r => {
    for (let i = 1; i <= length; i++) {
      if (lines[i] === r.comment) {
        let j = i + 1;
        while (lines[j] === '') {
          j++;
        }
        console.log('\n' + colors.cyan('-- TYPE MISMATCH -----------------------------------------------------------'));
        console.log(i + '|\t' + r.comment);
        for (let k = i + 1; k < j; k++) {
          console.log(k + '|');
        }
        console.log(colors.red('> ') + j + '|\t' + lines[j]);

        const typeDef = r.comment
          .replace('@type', '')
          .replace('/*', '')
          .replace('//', '')
          .trim();
        console.log(`\nThe type annotation for ${colors.bold(r.name)} says it is a:`);
        console.log(`\n\t${r.expected}`);
        console.log(`\nBut the definition (${colors.yellow(typeDef)}) is a:`);
        console.log(`\n\t${r.actual}`);
      }
    }
  });

  console.log(`\nFound ${errors.length} error${errors.length === 1 ? '' : 's'}\n`);
}

module.exports = print;

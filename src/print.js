const colors = require('colors');

function print(data, results, file, shouldThrow) {
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

        const tParts = r.comment.split('@type');
        const nParts = tParts[1].split('::');

        console.log(i + '|\t' + tParts[0] + colors.magenta('@') + colors.cyan('type ') + nParts[0] + colors.red('::') + colors.yellow(nParts[1]));
        for (let k = i + 1; k < j; k++) {
          console.log(k + '|');
        }

        if (r.isVariable) {
          console.log(colors.red('> ') + j + '|\t' + lines[j]);
        } else if (r.isArg || r.isReturn) {
          console.log(j + '|\t' + lines[j]);
          console.log('\n' +  colors.red('> ') + r.lineNumber + '|\t' + r.line);
        }

        console.log(`\nThe type annotation for ${colors.bold(r.name)} says it is a:`);
        console.log(`\n\t${r.expected}`);

        if (r.isVariable) {
          console.log(`\nBut the variable declaration (shown above) is a:`);
        } else if (r.isArg) {
          console.log(`\nBut the ${colors.italic('argument')} pass to the function call (shown above) is a:`);
        } else if (r.isReturn) {
          console.log(`\nBut the ${colors.italic('return value')} of the function call (shown above) is a:`);
        }
        console.log(`\n\t${r.actual}`);
      }
    }
  });

  console.log(`\nFound ${errors.length} error${errors.length === 1 ? '' : 's'} in ${colors.bold(file)}\n`);

  if (errors.length > 0 && shouldThrow) {
    throw new Error('Dak Static Type Error');
  }
}

module.exports = print;

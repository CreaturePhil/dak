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
        const parts = r.comment.split('@type');
        console.log(i + '|\t' + parts[0] + colors.magenta('@') + colors.cyan('type') + colors.yellow(parts[1]));
        for (let k = i + 1; k < j; k++) {
          console.log(k + '|');
        }

        if (r.isVariable) {
          console.log(colors.red('> ') + j + '|\t' + lines[j]);
        } else if (r.isArg || r.isReturn) {
          console.log(j + '|\t' + lines[j]);
          console.log('\n' +  colors.red('> ') + r.lineNumber + '|\t' + r.line);
        }

        const typeDef = r.comment
          .replace('@type', '')
          .replace('/*', '')
          .replace('//', '')
          .trim();
        console.log(`\nThe type annotation for ${colors.bold(r.name)} says it is a:`);
        console.log(`\n\t${colors.underline(r.expected)}`);

        if (r.isVariable) {
          console.log(`\nBut the variable declaration (shown above) is a:`);
        } else if (r.isArg) {
          console.log(`\nBut the ${colors.italic('argument')} pass to the function call (shown above) is a:`);
        } else if (r.isReturn) {
          console.log(`\nBut the ${colors.italic('return value')} of the function call (shown above) is a:`);
        }
        console.log(`\n\t${colors.underline(r.actual)}`);
      }
    }
  });

  console.log(`\nFound ${errors.length} error${errors.length === 1 ? '' : 's'}\n`);
}

module.exports = print;

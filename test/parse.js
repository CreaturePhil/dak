const test = require('ava');
const parse = require('../src/parse');

test('no types', t => {
  t.deepEqual(parse('// @dak'), []);
});

test('variable', t => {
  const result = parse(`
    // @dak
    // @type name :: String
  `);
  t.deepEqual(result, [{
    comment: '// @type name :: String',
    name: 'name',
    types: ['String']
  }]);
});

test('function', t => {
  const result = parse(`
    // @dak
    // @type name :: String -> Number
  `);
  t.deepEqual(result, [
    {
      comment: '// @type name :: String -> Number',
      name: 'name',
      types: ['String', 'Number']
    }
  ]);
});

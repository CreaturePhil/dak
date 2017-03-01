const test = require('ava');
const check = require('../src/check');

test('type mismatch variable', t => {
  const contents = `
  // @type str :: Number

  const str = "Hello, World!";
  `;
  const typeDefs = [{
    comment: '// @type str :: Number',
    name: 'str',
    types: ['Number']
  }];
  const expectedResult = [{
    check: 'error',
    comment: '// @type str :: Number',
    name: 'str',
    actual: 'String',
    expected: 'Number'
  }];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

test('type mismatch variable and correct type', t => {
  const contents = `
  // @type str :: Number

  const str = "Hello, World!";
  `;
  const typeDefs = [{
    comment: '// @type str :: Number',
    name: 'str',
    types: ['Number']
  },
  {comment: '', name: 'str', types: ['String']}
  ];
  const expectedResult = [
    {
      check: 'error',
      comment: '// @type str :: Number',
      name: 'str',
      actual: 'String',
      expected: 'Number'
    },
    {
      check: 'success',
      name: 'str'
    }
  ];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

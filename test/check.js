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
    expected: 'Number',
    isVariable: true
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
      expected: 'Number',
      isVariable: true
    },
    {
      check: 'success',
      name: 'str'
    }
  ];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

test('type mismatch function argument', t => {
  const contents = `
  // @type foo :: Number -> Number

  function foo(x) {
    return x * 10;
  }

  foo('Hello, world!');
  `;
  const typeDefs = [{
    comment: '// @type foo :: Number -> Number',
    name: 'foo',
    types: ['Number', 'Number']
  }];
  const expectedResult = [
    {
      check: 'error',
      comment: '// @type foo :: Number -> Number',
      name: 'foo',
      actual: 'String',
      expected: 'Number',
      line: "foo('Hello, world!');",
      lineNumber: 7,
      isArg: true
    },
    {
      check: 'success',
      name: 'foo',
      returnValue: NaN
    }
  ];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

test('type mismatch function argument and return type', t => {
  const contents = `
  // @type strLength :: String -> Number

  var strLength = function(s) {
    return s.length;
  }

  strLength({});
  `;
  const typeDefs = [{
    comment: '// @type strLength :: String -> Number',
    name: 'strLength',
    types: ['String', 'Number']
  }];
  const expectedResult = [
    {
      check: 'error',
      comment: '// @type strLength :: String -> Number',
      name: 'strLength',
      actual: 'Undefined',
      expected: 'Number',
      line: 'strLength({});',
      lineNumber: 7,
      isReturn: true
    }
  ];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

test('type mismatch array variable', t => {
  const contents = `
  // @type arr :: [Number]

  const arr = ["Hello, World!"];
  `;
  const typeDefs = [{
    comment: '// @type arr :: [Number]',
    name: 'arr',
    types: ['[Number]']
  }];
  const expectedResult = [{
    check: 'error',
    comment: '// @type arr :: [Number]',
    name: 'arr',
    actual: '[String]',
    expected: '[Number]',
    isVariable: true
  }];
  t.deepEqual(check(contents, typeDefs), expectedResult);
});

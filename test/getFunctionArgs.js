const test = require('ava');
const getFunctionArgs = require('../src/getFunctionArgs');

test('single string arg', t => {
  t.deepEqual(getFunctionArgs('f', 'f("Hi")'), ["Hi"]);
  t.deepEqual(getFunctionArgs('f', 'f("Hello, World!")'), ["Hello, World!"]);
  t.deepEqual(getFunctionArgs('f', 'f("{{template}} says hi")'), [
    '{{template}} says hi'
  ]);
});

test('multiple arg', t => {
  t.deepEqual(getFunctionArgs('f', 'f("Hi", 1, "yo, What is up?", 10)'), [
    "Hi", 1, "yo, What is up?", 10
  ]);
});

test('complex args', t => {
  const result = getFunctionArgs('yo', `
    yo('Hello, World!', [2,3], {a: [1,2], b: "({[]})"})
  `);
  t.deepEqual(result, [
    'Hello, World!', [ 2, 3 ], { a: [ 1, 2 ], b: '({[]})' }
  ]);
});

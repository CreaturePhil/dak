const test = require('ava');
const type = require('../src/type');

test('isArray', t => t.true(type.isArray([])));
test('isObject', t => t.true(type.isObject({})));
test('isString', t => t.true(type.isString('')));
test('isDate', t => t.true(type.isDate(new Date())));
test('isRegExp', t => t.true(type.isRegExp(/test/i)));
test('isFunction', t => t.true(type.isFunction(function() {})));
test('isBoolean', t => t.true(type.isBoolean(true)));
test('isNumber', t => t.true(type.isNumber(1)));
test('isNull', t => t.true(type.isNull(null)));
test('isUndefined', t => t.true(type.isUndefined(undefined)));

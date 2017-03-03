// @dak

/* hi */


// @type str :: Number

var str = 'hello world!';
console.log(str);


// @type foo :: Number -> Number
function foo(x) {
  return x * 10;
}

foo('Hello, world!');
foo(10);

// @type foo2 :: String -> Number -> String
function foo2(x, y) {
  return x.length * y;
}

//foo2('Hello', 42);

// @type strLength :: String -> Number
var strLength = function(s) {
  return s.length;
}

foo(strLength({}));
const l = strLength({});

// @type arr :: [Number]
var arr = ['string']

// @type arr2 :: [Number]
var arr2 = [1, 2, 'string']

// @type obj :: {foo: Number, bar: String}
var obj = {foo: "hi", bar: 2};

// @type fu :: Number -> [Number]
function fu(n) {
  return [n, n];
}

fu("a")

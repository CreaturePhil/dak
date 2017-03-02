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

strLength({});

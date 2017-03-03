<h1 align="center">dak</h1>

<div align="center">
  Static type checker using <a href="https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system">Hindley–Milner</a> type signatures
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/v/dak.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/CreaturePhil/dak">
    <img src="https://img.shields.io/travis/CreaturePhil/dak/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Dependencies -->
  <a href="https://david-dm.org/CreaturePhil/dak">
    <img src="https://david-dm.org/CreaturePhil/dak/status.svg?style=flat-square"
      alt="Dependencies" />
  </a>
  <!-- Dev Dependencies -->
  <a href="https://david-dm.org/CreaturePhil/dak?type=dev">
    <img src="https://david-dm.org/CreaturePhil/dak/dev-status.svg?style=flat-square"
      alt="Dev Dependencies" />
  </a>
</div>

## Install

```
$ npm install --global dak
```

## Usage

```
$ dak --help

Usage
$ dak [options] file.js [file.js] [dir]

Options
  --throw  Throws an error
```

## Examples

`hello.js` file:

```js
// @dak

// @type greet :: String -> String
function greet(person) {
    return "Hello, " + person;
}

var user = true;

greet(user);

// @type times10 :: Number -> Number
function times10(x) {
  return x * 10;
}

times10('Hello, world!');

// @type reducer :: {count: Number} -> {type: String} -> {count: Number}
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {count: state.count + 1};
    case 'DECREMENT':
      return {count: state.count - 1};
    default:
      return state;
  }
}

reducer({count: 0}, {type: 1});
```

Console output:

```
$ dak hello.js

-- TYPE MISMATCH -----------------------------------------------------------
2|	// @type  greet :: String -> String
3|	function greet(person) {

> 9|	greet(user);

The type annotation for greet says it is a:

	String

But the argument pass to the function call (shown above) is a:

	Boolean

-- TYPE MISMATCH -----------------------------------------------------------
11|	// @type  times10 :: Number -> Number
12|	function times10(x) {

> 16|	times10('Hello, world!');

The type annotation for times10 says it is a:

	Number

But the argument pass to the function call (shown above) is a:

	String

-- TYPE MISMATCH -----------------------------------------------------------
18|	// @type  reducer :: {count: Number} -> {type: String} -> {count: Number}
19|	function reducer(state, action) {

> 30|	reducer({count: 0}, {type: 1});

The type annotation for reducer says it is a:

	{type: String}

But the argument pass to the function call (shown above) is a:

	Number for the key "type"

Found 3 errors in hello.js
```

## License

[MIT](LICENSE)

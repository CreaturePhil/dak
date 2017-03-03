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

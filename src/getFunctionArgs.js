// @dak

// @type getFunctionArgs :: String -> String -> [a]
function getFunctionArgs(name, f) {
  let args = [];
  eval(`
    function ${name}() {
      args = Array.prototype.slice.call(arguments);
    }
    ${f}
  `);
  return args;
}

module.exports = getFunctionArgs;

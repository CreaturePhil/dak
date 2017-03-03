// @dak

// getType :: a -> String
function getType(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
}

module.exports = getType;

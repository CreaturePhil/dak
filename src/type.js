const types = [
  'Array',
  'Object',
  'String',
  'Date',
  'RegExp',
  'Function',
  'Boolean',
  'Number',
  'Null',
  'Undefined'
];

function getType(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
}

let type = {
  getType
};

types.forEach(t => {
  type['is' + t] = elem => getType(elem) === t;
});

module.exports = type;

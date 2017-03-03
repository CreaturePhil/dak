function primitiveType(valueType, typeDef) {
  return valueType === typeDef.types[0] ?
  [{
    check: 'success',
    name: typeDef.name
  }] :
  [{
    check: 'error',
    comment: typeDef.comment,
    name: typeDef.name,
    actual: valueType,
    expected: typeDef.types[0],
    isVariable: true
  }];
}

module.exports = primitiveType;

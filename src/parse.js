// @dak

const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

// @type parse :: String -> [{content: String, name: String, types: String}]
function parse(contents) {
  const comments = contents.match(commentRegex);

  if (comments[0].indexOf('@dak') < 0) return [];

  return comments
    .slice(1)
    .filter(comment => comment.indexOf('@type') >= 0)
    .map(comment => {
      let typeDef = comment.split('::');

      typeDef[0] = typeDef[0]
        .replace('@type', '')
        .replace('\n', '')
        .replace('/*', '')
        .replace('//', '');

      typeDef[1] = typeDef[1]
        .replace('*/', '')
        .replace('\n', '')
        .split('->');

      return {
        comment: comment.trim(),
        name: typeDef[0].trim(),
        types: typeDef[1].map(t => t.trim())
      };
    });
}

module.exports = parse;

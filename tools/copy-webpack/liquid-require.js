const path = require('path');
const fs = require('fs');


module.exports = function(content) {

  content = content.toString();
  let requireRegEx = /\{% require .*?\%}/g;
  var m;
  while (m = requireRegEx.exec(content)) {
    let result = m[0];
    let file = result.split("'")[1];
    let filePath = `../../src/includes/${file}.liquid`;
    const requireFile = fs.readFileSync(
      path.resolve(__dirname, filePath),
      'utf8',
    );
    content = content.replace(result, requireFile);
  }

  return content;
}
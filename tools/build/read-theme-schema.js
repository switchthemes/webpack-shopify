const path = require('path');
const fs = require('fs');

let themeSchema = fs.readFileSync(
  path.resolve(__dirname, '../../src/config/settings_schema.json'),
  'utf8',
);

themeSchema = JSON.parse(themeSchema);

const themeName = themeSchema[0].theme_name;
const themeVersion = themeSchema[0].theme_version;

module.exports = {
  themeName,
  themeVersion
}
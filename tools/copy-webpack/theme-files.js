const path = require('path');
const SvgTransform = require('./svg-transform');
const liquidRequire = require('./liquid-require');

const copyWebpackArray = [];
const folders = [
	'assets',
  'config',
  'content',
	'frame',
	'layout',
  'locales',
  'pages',
  'sections',
  'snippets',
  'templates',
  'templates/customers',
];

folders.forEach(function (folder) {
	let config = {
    from: path.resolve(__dirname, `../../src/${folder}`),
    to: path.resolve(__dirname, `../../dist/${folder}`),
    transform(content, path) {
      return liquidRequire(content, path);
    }
  };
  copyWebpackArray.push(config);
});

let svgConfig = {
  from: path.resolve(__dirname, '../../src/icons/*.svg'),
  to: path.resolve(__dirname, '../../dist/snippets/[name].liquid'),
  transform(content, path) {
    return SvgTransform(content, path);
  }
}

copyWebpackArray.push(svgConfig);

module.exports = copyWebpackArray;
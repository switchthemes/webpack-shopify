const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ip = require('ip');
const args = require('minimist')(process.argv.slice(2));
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


let devServerShellCommand = 'yarn shopify-dev-server';
let storeParams = args['store'] ? ' --store=' + args['store'] : ' shopify-dev-server --store=dev';
let watchParams = args['watch'] ? ' --watch':'';
devServerShellCommand = devServerShellCommand + storeParams + watchParams;

module.exports = env => ({
  watch: true,
  devServer: {
    https: true,
    host: ip.address(),
    port: 8080,
    index: '',
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: path.resolve(__dirname, '..', 'dist'),
      //cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new WriteFilePlugin({
      test: /^(?!.+(?:theme.min.js)).+$/,
    }),
    new HtmlWebpackPlugin({
      filename: 'snippets/style-tags.liquid',
      template: path.resolve(__dirname, '../copy-webpack/templates/style-tags.html'),
      inject: false,
      stats: {
        children: false, 
      }
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, '../../src/includes'),
        to: path.resolve(__dirname, '../../dist/includes')
      }
    ]),
    new WebpackShellPlugin(
      {
        onBuildStart:['echo "Webpack Start"'],
        onBuildEnd:[
          devServerShellCommand
        ]
      }
    )
  ],
  stats: {
    children: false
  }
});
const path = require('path');
const fs = require('fs');
const WebpackZipPlugin = require('webpack-zip-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../build/include-liquid-styles');
const {themeName, themeVersion } = require('../build/read-theme-schema');
const WrapperPlugin = require('wrapper-webpack-plugin');

const cssVariableFile = fs.readFileSync(
  path.resolve(__dirname, '../../src/snippets/css-variables.liquid'),
  'utf8',
);
const liquidVariables = cssVariableFile.split('<style>').pop().split(':root').shift();

module.exports = () => ({
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'snippets/style-tags.liquid',
      template: path.resolve(__dirname, '../copy-webpack/templates/style-tags.html'),
      inject: false,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
    }),
    new HtmlWebpackIncludeLiquidStylesPlugin(),
    new WrapperPlugin({
      test: /\.css\.liquid$/,
      header: liquidVariables,
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/theme.css.liquid',
    }),
    new WebpackZipPlugin({
      initialFile: 'dist',
      endPath: './upload/',
      zipName: `${themeName}-${themeVersion}.zip`
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          MiniCssExtractPlugin.loader,
          '@shopify/slate-cssvar-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  }
});
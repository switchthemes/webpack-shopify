const path = require('path');

const envConfig = env => require(`./tools/webpack-configs/webpack.${env.mode}.js`)(env);
const webpackMerge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const ThemeFiles = require('./tools/copy-webpack/theme-files.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const ip = require('ip');

module.exports = env => {
  return webpackMerge(
    {
      mode: env.mode,
      entry: {
        theme: "./src/scripts/theme.js"
      },
      plugins: [
        new UnminifiedWebpackPlugin(),
        new HtmlWebpackPlugin({
          filename: 'snippets/script-tags.liquid',
          template: path.resolve(__dirname, 'tools/copy-webpack/templates/script-tags.html'),
          inject: false,
          env: env.mode,
          host: ip.address(),
          port: 8080,
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
        new CopyPlugin(ThemeFiles)
       
      ],
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "assets/[name].min.js"
      }
    },
    envConfig(env)
  );
}
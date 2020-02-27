const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const { createProxyMiddleware } = require('http-proxy-middleware');
const ip = require('ip');

let store = '';
if(args['store'])  {
  store =  args['store'];
} else {
  store = 'dev';
}

require('dotenv').config({
  path: path.resolve(__dirname, '../../.store.' + store)
})

module.exports = {
  https: true,
  port: 3002,
  files: path.resolve(__dirname, './theme.update'),
  reloadDelay: 800,
  notify: false,
  proxy: {
    target: 'https://' + process.env.SLATE_STORE + (process.env.SLATE_THEME_ID === 'live' ? '' : `?preview_theme_id=${process.env.SLATE_THEME_ID}`),
    middleware: (req, res, next) => {
      // Shopify sites with redirection enabled for custom domains force redirection
      // to that domain. `?_fd=0` prevents that forwarding.
      // ?pb=0 hides the Shopify preview bar
      const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
      const queryStringComponents = ['_fd=0&pb=0'];

      req.url += prefix + queryStringComponents.join('&');

      //check if request is hot reload
      if( req.url.indexOf('hot-update') > -1 ) {

        let target = 'https://' + ip.address() + ':8080';
        console.log(target)
        createProxyMiddleware({
          target,
          changeOrigin: true,
          secure: false,
        })(req, res, next); 

      } else {
        next();
      }
      
    },
    proxyRes: [
      function(proxyRes) {
        // disable HSTS. Slate might force us to use HTTPS but having HSTS on local dev makes it impossible to do other non-Slate dev.
        delete proxyRes.headers['strict-transport-security'];
      },
    ],
  },
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: function (snippet, match) {
          return snippet + match;
      }
    }
  }
}


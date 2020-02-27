
// From https://github.com/Shopify/slate/blob/790f8c0f6e94299cc13fa7a62cc870feeb793de5/packages/slate-sync/index.js

const path = require('path');
const https = require('https');
const args = require('minimist')(process.argv.slice(2));
require('dotenv').config({
  path: path.resolve(__dirname, '../../.store.' + args['store'])
})

module.exports = function() {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: process.env.SLATE_STORE,
        path: '/admin/themes.json',
        auth: `:${process.env.SLATE_PASSWORD}`,
        agent: false,
        headers: {
          'X-Shopify-Access-Token': process.env.SLATE_PASSWORD,
        },
      },
      (res) => {
        let body = '';

        res.on('data', (datum) => (body += datum));

        res.on('end', () => {
          const parsed = JSON.parse(body);

          if (parsed.errors) {
            reject(
              new Error(
                `API request to fetch main theme ID failed: \n${JSON.stringify(
                  parsed.errors,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          if (!Array.isArray(parsed.themes)) {
            reject(
              new Error(
                `Shopify response for /admin/themes.json is not an array. ${JSON.stringify(
                  parsed,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          const mainTheme = parsed.themes.find((t) => t.role === 'main');

          if (!mainTheme) {
            reject(
              new Error(
                `No main theme in response. ${JSON.stringify(
                  parsed.themes,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          resolve(mainTheme.id);
        });
      },
    );
  });
}
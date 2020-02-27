const path = require('path')
const args = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const themekit = require('@shopify/themekit').command;
const browserSyncConfig = require('./browsersync-config');
const promptContinueIfPublishedTheme = require('./continue-if-published-theme');
const bs = require("browser-sync").create();

let store = '';
if(args['store'])  {
  store =  args['store'];
} else {
  store = 'dev';
}

let watch = '';
if(args['watch'])  {
  watch =  true;
} else {
  watch = false;
}


require('dotenv').config({
  path: path.resolve(__dirname, '../../.store.' + store)
})




const startThemekit = async function() {

  let continueIfPublishedTheme = null;

  await themekit(
    'configure',
    {
      password: process.env.SLATE_PASSWORD,
      store: process.env.SLATE_STORE,
      themeid: process.env.SLATE_THEME_ID,
      env: store,
      ignoredFiles: process.env.SLATE_IGNORE_FILES.split(':')
    },
    {
      cwd: path.resolve(__dirname, '../../dist')
    }
  );
  
  if (continueIfPublishedTheme === null) {
    try {
      continueIfPublishedTheme = await promptContinueIfPublishedTheme();
    } catch (error) {
      console.log(`\n${chalk.red(error)}\n`);
    }
  }

  if (!continueIfPublishedTheme) {
    process.exit(1);
  }
  
  
  if(!watch) {
    await themekit(
      'deploy', {
        env: store
      },
      {
        cwd: path.resolve(__dirname, '../../dist')
      }
    );
  }
  
  bs.init(browserSyncConfig);

  await themekit(
    'watch', {
      env: store,
      notify:  path.resolve(__dirname, './theme.update')
    },
    {
      cwd: path.resolve(__dirname, '../../dist')
    }
  );

};

startThemekit();


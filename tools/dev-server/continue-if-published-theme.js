// https://github.com/Shopify/slate/blob/65deea3799a14e1efd5cdf4e72d623ff8e0f1215/packages/slate-tools/cli/prompts/continue-if-published-theme.js

const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const fetchMainThemeId = require('./get-main-theme-id');
const args = require('minimist')(process.argv.slice(2));
var inquirer = require('inquirer');


require('dotenv').config({
  path: path.resolve(__dirname, '../../.store.' + args['store'])
})
const question = {
  type: 'confirm',
  name: 'continueWithDeploy',
  message: 'You are about to deploy to the published theme. Continue?',
  default: true,
  prefix: chalk.yellow(`${figures.warning} `),
};


module.exports = async function continueIfPublishedTheme() {

  let publishedThemeId = await fetchMainThemeId();
  let currentThemeId = process.env.SLATE_THEME_ID;

  if (
    currentThemeId !== 'live' &&
    currentThemeId !== publishedThemeId.toString()
  ) {
    return question.default;
  }

  console.log();
  const answer = await inquirer.prompt([question]);

  return answer.continueWithDeploy;
};
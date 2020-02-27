# Webpack Shopify

A webpack tool for Shopify themes. Taking inspiration from Shopify Slate 1.x. - this is a more stripped down version. 

# Getting Started

1. Install dependencies - `yarn install`

2. Add your theme src files to `/src/`. See the [example src folder](https://github.com/switchthemes/webpack-shopify/tree/master/__src-examples) for SASS, Javascript and Icons

3. Rename `.store.dev.example` to `.store.dev` and fill out your store credentials

4. Make sure `theme.liquid` includes `style-tags` and `script-tags`

# Commands

Dev - starts a webpack dev server, proxies your shopify store

`yarn dev`\
`yarn dev --watch` - this will skip deploy process

Build - builds your theme for deployment and creates a zip file

`yarn build`

# Features

## Development
When running `yarn dev` Webpack will start a dev server, whilst Browsersync will start a proxy URL to your Shopify store. This is similar to Slate 1.x.

Webpack will automatically update theme.liquid to reference the local `theme.min.js` file (this also injects the CSS for HMR). You may need to open up your local theme.min.js link and bypass the security warning in order for your site to load. (Check your console logs when the browsersync URL opens).

Once this is up and running HMR will be working for SASS. 

## CSS Variables
This uses the CSS Var Loader that was in Slate 1.x. When you build your theme, SASS Variables will be replaced by matching Liquid variables. You can also add any Liquid statements above `:root` in the css-variables.liquid file and they will be moved across. 

## Icons
Any `svg` icons added to `/src/icons/` will go through SVGO and then transformed into snippets.

## Liquid Includes
As a future proof for `render` over `include`. You can use `{% require 'file' %}` to include liquid files from the `/includes/` directory before they are uploaded to Shopify. This is useful if you use Shopify's `include' function to import global liquid variables.

## Build
Webpack will build your theme for deployment and split out the CSS and JS files (it will also include an unminified JS file). Webpack will also create a zip file using the Theme Name and Theme Version from the theme schema. 

## Environments
Default environment is `.store.dev`. Add any additional environments as another store file e.g. `.store.prod`. By default scripts will run using `dev` as default store. To overwrite this set it in the command e.g. `yarn dev --store=prod`
# Webpack Shopify

A webpack tool for Shopify themes. Taking inspiration from Shopify Slate 1.x. - this is a more stripped down version. 

# Getting Started

1. Install dependencies - `yarn install`

2. Add your theme src files to `/src/`. See the [example src config](https://github.com/switchthemes/webpack-shopify/tree/master/__src-examples) for SASS, Javascript and Icons

3. Rename `.store.dev.example` to `.store.dev` and fill out your store credentials

4. To develop, 

# Commands

Dev - starts a webpack dev server, proxies your shopify store

`yarn dev`\
`yarn dev --watch` - this will skip deploy process

Build - builds your theme for deployment and creates a zip file

`yarn build`


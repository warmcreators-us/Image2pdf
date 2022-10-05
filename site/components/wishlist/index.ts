export { default as WishlistCard } from './WishlistCard'
export { default as WishlistButton } from './WishlistButton'
{
    "name": "@vercel/commerce-shopify",
    "version": "0.0.1",
    "license": "MIT",
    "scripts": {
      "release": "taskr release",
      "build": "taskr build",
      "dev": "taskr",
      "types": "tsc --emitDeclarationOnly",
      "prettier-fix": "prettier --write .",
      "generate": "DOTENV_CONFIG_PATH=./.env graphql-codegen -r dotenv/config"
    },
    "sideEffects": false,
    "type": "module",
    "exports": {
      ".": "./dist/index.js",
      "./*": [
        "./dist/*.js",
        "./dist/*/index.js"
      ],
      "./next.config": "./dist/next.config.cjs"